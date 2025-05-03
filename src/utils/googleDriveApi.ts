/**
 * Simple Google Drive API Service
 * Uses direct links to Google Drive files for reliable image display
 */

// Log available environment variables for debugging
console.log("Available environment variables:", {
  FOLDER_ID_ENV: import.meta.env.VITE_DRIVE_FOLDER_ID,
  API_KEY_ENV: import.meta.env.VITE_DRIVE_API_KEY,
  CLIENT_ID_ENV: import.meta.env.VITE_OAUTH_CLIENT_ID
});

// Google Drive folder ID containing event images from environment variables
export const FOLDER_ID = import.meta.env.VITE_DRIVE_FOLDER_ID || "1nBLShRNqH9574JRWAN7-LAkqaUCg2vqg";

// Google API key for authenticated requests from environment variables
export const API_KEY = import.meta.env.VITE_DRIVE_API_KEY || "AIzaSyBNCIBYnFPS0jtStcsVf9ytXsOJj28Jzo4";

// Google OAuth credentials
export const OAUTH_CONFIG = {
  client_id: import.meta.env.VITE_OAUTH_CLIENT_ID || "997637534037-1ef2mf5bs76p2gikt0f4goeohk698mlr.apps.googleusercontent.com",
  client_secret: import.meta.env.VITE_OAUTH_CLIENT_SECRET || "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",
  redirect_uri: import.meta.env.VITE_OAUTH_REDIRECT_URI || "http://localhost:8080",
  scope: "https://www.googleapis.com/auth/drive.readonly",
  discovery_docs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
};

// Log the actual values being used
console.log("Using configuration:", {
  FOLDER_ID,
  API_KEY,
  OAUTH_CLIENT_ID: OAUTH_CONFIG.client_id,
  OAUTH_REDIRECT_URI: OAUTH_CONFIG.redirect_uri
});

// Image interface for gallery component
export interface DriveImage {
  src: string;
  alt: string;
  thumbSrc: string;
  alternateUrls: string[];
  fileName: string;
  fileId: string;
}

// Authentication state
let accessToken: string | null = null;
let tokenExpiry: number | null = null;

// Cache for image list to avoid repeated API calls
let imageCache: DriveImage[] | null = null;
let imageCacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Initialize OAuth client and attempt silent sign-in if previous auth exists
 */
export const initOAuth = async (): Promise<boolean> => {
  try {
    // Check if we already have a token in localStorage
    const savedToken = localStorage.getItem('gd_access_token');
    const savedExpiry = localStorage.getItem('gd_token_expiry');
    
    if (savedToken && savedExpiry) {
      // Check if token is still valid
      if (Date.now() < parseInt(savedExpiry)) {
        accessToken = savedToken;
        tokenExpiry = parseInt(savedExpiry);
        console.log("Using existing OAuth token");
        return true;
      }
    }
    
    // Load the Google API client library
    await loadGoogleApi();
    
    // Initialize the client
    await window.gapi.client.init({
      apiKey: API_KEY,
      clientId: OAUTH_CONFIG.client_id,
      scope: OAUTH_CONFIG.scope,
      discoveryDocs: OAUTH_CONFIG.discovery_docs
    });
    
    // Try silent sign-in
    const isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
    if (isSignedIn) {
      const authInstance = window.gapi.auth2.getAuthInstance();
      const currentUser = authInstance.currentUser.get();
      const authResponse = currentUser.getAuthResponse();
      
      accessToken = authResponse.access_token;
      tokenExpiry = authResponse.expires_at;
      
      // Save to localStorage for future sessions
      localStorage.setItem('gd_access_token', accessToken);
      localStorage.setItem('gd_token_expiry', tokenExpiry.toString());
      
      console.log("Silent sign-in successful");
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error initializing OAuth:", error);
    return false;
  }
};

/**
 * Load the Google API client library
 */
const loadGoogleApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Skip if already loaded
    if (window.gapi && window.gapi.client) {
      resolve();
      return;
    }
    
    // Load Google API script
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      window.gapi.load('client:auth2', () => {
        resolve();
      });
    };
    
    script.onerror = (error) => {
      reject(error);
    };
    
    document.body.appendChild(script);
  });
};

/**
 * Sign in with Google
 */
export const signIn = async (): Promise<boolean> => {
  try {
    if (!window.gapi || !window.gapi.auth2) {
      await loadGoogleApi();
      await window.gapi.client.init({
        apiKey: API_KEY,
        clientId: OAUTH_CONFIG.client_id,
        scope: OAUTH_CONFIG.scope,
        discoveryDocs: OAUTH_CONFIG.discovery_docs
      });
    }
    
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signIn();
    
    const currentUser = authInstance.currentUser.get();
    const authResponse = currentUser.getAuthResponse();
    
    accessToken = authResponse.access_token;
    tokenExpiry = authResponse.expires_at;
    
    // Save to localStorage for future sessions
    localStorage.setItem('gd_access_token', accessToken);
    localStorage.setItem('gd_token_expiry', tokenExpiry.toString());

    // Clear cache to force reload with new credentials
    clearImageCache();
    
    return true;
  } catch (error) {
    console.error("Error signing in:", error);
    return false;
  }
};

/**
 * Sign out from Google
 */
export const signOut = async (): Promise<void> => {
  try {
    if (window.gapi && window.gapi.auth2) {
      await window.gapi.auth2.getAuthInstance().signOut();
    }
    
    accessToken = null;
    tokenExpiry = null;
    
    localStorage.removeItem('gd_access_token');
    localStorage.removeItem('gd_token_expiry');

    // Clear cache to force reload without credentials
    clearImageCache();
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

/**
 * Clear the image cache
 */
export const clearImageCache = (): void => {
  imageCache = null;
  imageCacheTimestamp = null;
  console.log("Image cache cleared");
};

/**
 * Get a direct URL to a Google Drive image
 * We use a direct Google Drive URL that works consistently across browsers
 */
export const getImageUrl = (fileId: string): string => {
  // Use the direct link format that works more reliably
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

/**
 * Get a thumbnail URL for a Google Drive image
 */
export const getThumbnailUrl = (fileId: string): string => {
  // Use the direct thumbnail URL for better compatibility
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w200`;
};

/**
 * Get alternative URL formats for a Google Drive image
 */
export const getAlternateUrls = (fileId: string): string[] => {
  // Try multiple formats in order of reliability
  const urls = [
    // Direct view links for Google Drive
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://drive.google.com/uc?id=${fileId}`,
    
    // Direct download links
    `https://drive.google.com/uc?id=${fileId}&export=download`,
    
    // Google Photo-style direct links (sometimes more reliable for images)
    `https://lh3.googleusercontent.com/d/${fileId}`,
    `https://lh3.googleusercontent.com/d/${fileId}=s0`,
    
    // Thumbnails as fallback
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`,
  ];
  
  // Add authenticated URLs if available
  if (accessToken) {
    urls.unshift(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&access_token=${accessToken}`);
  } else if (API_KEY) {
    urls.unshift(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${API_KEY}`);
  }
  
  return urls;
};

/**
 * Get a list of images with URLs for the gallery component
 */
export const getEventImages = async (): Promise<DriveImage[]> => {
  // Always clear cache to ensure fresh images
  clearImageCache();
  
  // Try to initialize OAuth first
  await initOAuth();
  
  try {
    // Validate configuration
    if (!FOLDER_ID) {
      console.error("Missing Google Drive folder ID. Check your environment variables.");
      throw new Error("Missing Google Drive folder ID");
    }
    
    // Add timestamp to break cache
    const cacheBuster = `&cb=${Date.now()}`;
    
    // Enhanced console logging for debugging
    console.log("Starting to fetch images with these parameters:", {
      FOLDER_ID,
      API_KEY: API_KEY ? 'Present' : 'Missing',
      accessToken: accessToken ? 'Present' : 'Missing'
    });
    
    let files: any[] = [];
    
    // Try to fetch images using OAuth if available
    if (accessToken) {
      console.log("Fetching images using OAuth token");
      
      try {
        // Use direct Google API URL with cache buster
        const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name,mimeType,thumbnailLink)&pageSize=1000`;
        console.log("OAuth URL:", url);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        
        console.log("OAuth response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          files = data.files || [];
          console.log(`Found ${files.length} files through OAuth`);
        } else {
          // OAuth token might be invalid
          console.log("OAuth request failed, trying API key");
          console.log("Response status:", response.status);
          const errorText = await response.text();
          console.log("Error details:", errorText);
          
          accessToken = null;
          localStorage.removeItem('gd_access_token');
          localStorage.removeItem('gd_token_expiry');
        }
      } catch (oauthError) {
        console.error("Error during OAuth fetch:", oauthError);
      }
    }
    
    // If no files yet (OAuth failed or not available), try API key
    if (files.length === 0) {
      // Check if we have an API key
      if (!API_KEY) {
        console.error("Missing Google API key. Check your environment variables.");
        throw new Error("Missing Google API key");
      }
      
      // Use direct Google API URL with API key and cache buster
      const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name,mimeType,thumbnailLink)&key=${API_KEY}&pageSize=1000`;
      
      console.log("Fetching images with API key...");
      console.log("API URL:", apiUrl);
      
      try {
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          },
          cache: 'no-store'
        });
        
        console.log("API key response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          files = data.files || [];
          console.log(`Found ${files.length} files through API key`);
        } else {
          console.log("API request failed");
          console.log("Response status:", response.status);
          const errorText = await response.text();
          console.log("Error details:", errorText);
          throw new Error(`API request failed with status ${response.status}`);
        }
      } catch (apiError) {
        console.error("Error during API key fetch:", apiError);
        throw apiError;
      }
    }
    
    // Process the files into image objects
    if (files.length > 0) {
      // Sort files to ensure consistent display order
      files.sort((a: any, b: any) => {
        // Sort by name (or fallback to id if name missing)
        return (a.name || a.id).localeCompare(b.name || b.id);
      });
      
      const images = files.map((file: any) => {
        // Get the primary source URL for this image
        const primarySrc = getImageUrl(file.id);
        
        // Get thumbnail URL
        const thumbSrc = getThumbnailUrl(file.id);
        
        // Get alternate URLs
        const alternateUrls = getAlternateUrls(file.id);
        
        // Create DriveImage object with all URLs and cache busters
        const image: DriveImage = {
          src: primarySrc + cacheBuster,
          alt: file.name || `Image ${file.id}`,
          thumbSrc: thumbSrc + cacheBuster,
          alternateUrls: alternateUrls.map(url => url + cacheBuster),
          fileName: file.name || `Image ${file.id}`,
          fileId: file.id,
        };
        return image;
      });
      
      console.log(`Successfully prepared ${images.length} images for gallery`);
      
      // Cache the result
      imageCache = images;
      imageCacheTimestamp = Date.now();
      
      return images;
    } else {
      console.error("No images found in the specified Google Drive folder");
      throw new Error("No images found in the specified Google Drive folder");
    }
  } catch (error) {
    console.error("Error fetching images from Drive API:", error);
    throw error;
  }
};

// Add global type declarations for Google API
declare global {
  interface Window {
    gapi: any;
  }
} 
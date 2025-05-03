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
  // Use a more reliable method that works even with restricted Drive permissions
  // Add the 'usp=sharing' parameter which helps bypass some restrictions
  return `https://drive.google.com/uc?export=view&id=${fileId}&usp=sharing`;
};

/**
 * Get a thumbnail URL for a Google Drive image
 */
export const getThumbnailUrl = (fileId: string): string => {
  // Use the larger thumbnail size for better quality
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w500&usp=sharing`;
};

/**
 * Get alternative URL formats for a Google Drive image
 */
export const getAlternateUrls = (fileId: string): string[] => {
  // Try multiple formats in order of reliability
  const urls = [
    // Direct approach with sharing parameter
    `https://drive.google.com/uc?id=${fileId}&export=view&usp=sharing`,
    
    // Try with direct download
    `https://drive.google.com/uc?id=${fileId}&export=download&usp=sharing`,
    
    // Open in new window approach (can work when others fail)
    `https://drive.google.com/file/d/${fileId}/preview`,
    
    // Embedded content URL
    `https://drive.google.com/file/d/${fileId}/view`,
    
    // Try Google Photos-style direct links
    `https://lh3.googleusercontent.com/d/${fileId}`,
    
    // Use thumbnails as last resort
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`,
  ];
  
  // Add authenticated URLs if available - these are more likely to work
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
  // Clear cache to ensure fresh images
  clearImageCache();
  
  // Try to initialize OAuth first
  await initOAuth();
  
  try {
    // Validate configuration
    if (!FOLDER_ID) {
      console.error("Missing Google Drive folder ID. Check your environment variables.");
      throw new Error("Missing Google Drive folder ID");
    }
    
    console.log("Fetching images from folder ID:", FOLDER_ID);
    
    // Use a direct link to the Drive folder's contents
    const folderUrl = `https://drive.google.com/drive/folders/${FOLDER_ID}`;
    console.log("Folder URL for reference:", folderUrl);
    
    // Add timestamp to break cache
    const cacheBuster = `&cb=${Date.now()}`;
    
    // Try different APIs based on available credentials
    let files: any[] = [];
    let error = null;
    
    // Try the API key approach first if available
    if (API_KEY) {
      try {
        const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name,mimeType)&key=${API_KEY}&pageSize=100`;
        console.log("Using API key method:", apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          files = data.files || [];
          console.log(`Found ${files.length} files using API key`);
        } else {
          error = `API key method failed with status ${response.status}`;
          console.error(error);
        }
      } catch (err) {
        error = "API key method failed: " + (err instanceof Error ? err.message : String(err));
        console.error(error);
      }
    }
    
    // Try OAuth approach if available and API key method failed
    if (files.length === 0 && accessToken) {
      try {
        const oauthUrl = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name,mimeType)&pageSize=100`;
        console.log("Using OAuth method:", oauthUrl);
        
        const response = await fetch(oauthUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          files = data.files || [];
          console.log(`Found ${files.length} files using OAuth`);
        } else {
          error = `OAuth method failed with status ${response.status}`;
          console.error(error);
        }
      } catch (err) {
        error = "OAuth method failed: " + (err instanceof Error ? err.message : String(err));
        console.error(error);
      }
    }
    
    // If no files found and no specific error, provide a generic error
    if (files.length === 0) {
      const errorMessage = error || "No files found in the specified folder";
      throw new Error(errorMessage);
    }
    
    // Process files into DriveImage objects
    console.log("Processing files into image objects", files);
    
    // Sort files by name for consistent ordering
    files.sort((a: any, b: any) => {
      return (a.name || a.id).localeCompare(b.name || b.id);
    });
    
    // Map file metadata into DriveImage objects with all necessary URLs
    const images = files.map((file: any) => {
      // Use our utility functions to generate URLs
      const src = getImageUrl(file.id);
      const thumbSrc = getThumbnailUrl(file.id);
      const alternateUrls = getAlternateUrls(file.id);
      
      return {
        src: src + cacheBuster,
        alt: file.name || `Image ${file.id}`,
        thumbSrc: thumbSrc + cacheBuster,
        alternateUrls: alternateUrls.map(url => url + cacheBuster),
        fileName: file.name || `Image ${file.id}`,
        fileId: file.id
      };
    });
    
    console.log(`Successfully prepared ${images.length} images for gallery`);
    
    // Update cache
    imageCache = images;
    imageCacheTimestamp = Date.now();
    
    return images;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
};

// Add global type declarations for Google API
declare global {
  interface Window {
    gapi: any;
  }
} 
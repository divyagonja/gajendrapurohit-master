import { useEffect, useState, useRef } from "react";
import { GalleryHorizontal, RefreshCw } from "lucide-react";
import { getEventImages, DriveImage, signIn, signOut, initOAuth, FOLDER_ID, API_KEY, clearImageCache } from "../utils/googleDriveApi";

// Preload all images to avoid CORS issues
const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = url;
  });
};

// Add this constant at the top of the file after imports
const PLACEHOLDER_IMAGE_URL = "/placeholder-image.svg";

const EventsGallery = () => {
  const [images, setImages] = useState<DriveImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState<{
    folderIdSet: boolean;
    apiKeySet: boolean;
    imagesAttempted: boolean;
    imagesLoaded: number;
  }>({
    folderIdSet: Boolean(FOLDER_ID),
    apiKeySet: Boolean(API_KEY),
    imagesAttempted: false,
    imagesLoaded: 0
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [imgLoadAttempts, setImgLoadAttempts] = useState<Record<number, number>>({});
  const [retryCount, setRetryCount] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(0);

  useEffect(() => {
    console.log("EventsGallery: Component mounted");
    console.log("Environment configuration:", {
      FOLDER_ID,
      API_KEY,
      VITE_DRIVE_FOLDER_ID: import.meta.env.VITE_DRIVE_FOLDER_ID,
      VITE_DRIVE_API_KEY: import.meta.env.VITE_DRIVE_API_KEY
    });
    
    // Try to initialize OAuth first, then load images
    const init = async () => {
      try {
        // Check if user is already authenticated
        const isAuthed = await initOAuth();
        setIsAuthenticated(isAuthed);
        console.log(`EventsGallery: Authentication status: ${isAuthed ? 'Authenticated' : 'Not authenticated'}`);
      } catch (error) {
        console.error('Error initializing OAuth:', error);
      }
      
      // Load images regardless of authentication status
      loadImages();
    };
    
    init();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [forceRefresh]);

  const loadImages = async () => {
    setIsLoading(true);
    setError(null);
    setImgLoadAttempts({});
    
    try {
      console.log("EventsGallery: Fetching images...");
      setDiagnosticInfo(prev => ({ ...prev, imagesAttempted: true }));
      
      const imagesData = await getEventImages();
      console.log(`EventsGallery: Received ${imagesData.length} images`, imagesData);
      
      if (imagesData.length === 0) {
        throw new Error("No images were loaded");
      }
      
      // Store the images first so UI shows something quickly
      setImages(imagesData);
      
      // Then preload all main image URLs in the background
      // We do this after setting the state so the UI is responsive
      let loadedCount = 0;
      
      setTimeout(() => {
        imagesData.forEach((image, index) => {
          // Try to preload the main image
          preloadImage(image.src)
            .then(() => {
              console.log(`Preloaded image ${index}: ${image.fileName}`);
              loadedCount++;
              setDiagnosticInfo(prev => ({ ...prev, imagesLoaded: loadedCount }));
            })
            .catch(() => {
              console.log(`Failed to preload image ${index}, trying alternates`);
              // Try each alternate URL
              let triedAlternateUrl = false;
              
              image.alternateUrls.forEach((altUrl, altIndex) => {
                if (!triedAlternateUrl) {
                  preloadImage(altUrl)
                    .then(() => {
                      console.log(`Successfully loaded alternate URL ${altIndex} for image ${index}`);
                      // Update the image source to the working URL
                      triedAlternateUrl = true;
                      loadedCount++;
                      setDiagnosticInfo(prev => ({ ...prev, imagesLoaded: loadedCount }));
                      
                      // Update the specific image with the working URL
                      setImages(currentImages => {
                        const updatedImages = [...currentImages];
                        if (updatedImages[index]) {
                          updatedImages[index].src = altUrl;
                        }
                        return updatedImages;
                      });
                    })
                    .catch(() => {
                      console.log(`Failed to load alternate URL ${altIndex} for image ${index}`);
                    });
                }
              });
            });
        });
      }, 100);
      
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error("Error loading images:", error);
      setError("Failed to load images. Please check console for details.");
      
      // Retry loading a few times if failed
      if (retryCount < 3) {
        console.log(`Retrying image load... Attempt ${retryCount + 1}/3`);
        setRetryCount(prev => prev + 1);
        setTimeout(loadImages, 2000); // Wait 2 seconds before retrying
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceRefresh = () => {
    clearImageCache();
    setForceRefresh(prev => prev + 1);
  };

  // Start auto-play when images are loaded
  useEffect(() => {
    if (images.length > 0) {
      console.log("EventsGallery: Starting auto-play");
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [images]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000);
    }
  };

  const handleImageError = (index: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    const currentImg = images[index];
    const attempts = imgLoadAttempts[index] || 0;
    
    console.log(`EventsGallery: Image ${index} failed to load: ${target.src}`);
    
    // Try alternate URLs if available
    if (currentImg.alternateUrls && attempts < currentImg.alternateUrls.length) {
      const nextUrl = currentImg.alternateUrls[attempts];
      console.log(`EventsGallery: Trying alternate URL for image ${index}: ${nextUrl}`);
      
      // Update attempts count
      setImgLoadAttempts({...imgLoadAttempts, [index]: attempts + 1});
      
      // Set new URL
      target.src = nextUrl;
    } else {
      // All alternates failed, use placeholder
      console.log(`EventsGallery: All URLs failed for image ${index}, using placeholder`);
      target.src = PLACEHOLDER_IMAGE_URL;
    }
  };

  const handleThumbnailError = (index: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    console.log(`EventsGallery: Thumbnail ${index} failed to load`);
    
    // Try using the main image if the thumbnail fails
    const currentImg = images[index];
    if (currentImg.src && currentImg.src !== target.src) {
      target.src = currentImg.src;
    } else {
      target.src = `https://via.placeholder.com/100x100?text=${index+1}`;
    }
  };

  const handleAuthSignIn = async () => {
    try {
      const success = await signIn();
      setIsAuthenticated(success);
      if (success) {
        console.log("Auth successful, reloading images with permissions");
        loadImages(); // Reload images with new authentication
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleAuthSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      console.log("Signed out, reloading images without permissions");
      loadImages(); // Reload images without authentication
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const renderDiagnosticInfo = () => {
    if (error && diagnosticInfo.imagesAttempted) {
      return (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded text-sm">
          <h3 className="font-bold mb-2">Diagnostic Information:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Drive Folder ID: {diagnosticInfo.folderIdSet ? '✅ Set' : '❌ Missing'}</li>
            <li>API Key: {diagnosticInfo.apiKeySet ? '✅ Set' : '❌ Missing'}</li>
            <li>Current Folder ID: {FOLDER_ID || 'Not available'}</li>
            <li>Images successfully loaded: {diagnosticInfo.imagesLoaded || 0}</li>
            {!diagnosticInfo.folderIdSet && (
              <li className="text-red-600">Add VITE_DRIVE_FOLDER_ID to your .env file</li>
            )}
            {!diagnosticInfo.apiKeySet && (
              <li className="text-red-600">Add VITE_DRIVE_API_KEY to your .env file</li>
            )}
            <li className="mt-2">
              <button 
                onClick={handleForceRefresh}
                className="px-3 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Force Refresh
              </button>
            </li>
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <GalleryHorizontal className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Event Photo Gallery</h2>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={handleForceRefresh}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg flex items-center gap-3 transform hover:scale-105 duration-200"
              disabled={isLoading}
            >
              <svg 
                className={`w-5 h-5 ${isLoading ? 'animate-spin' : 'animate-pulse'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              <span className="font-medium">
                {isLoading ? 'Loading Gallery...' : 'Refresh Gallery'}
              </span>
            </button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4">Loading event photos{retryCount > 0 ? ` (Retry ${retryCount}/3)` : ''}...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">
            <p>{error}</p>
            {renderDiagnosticInfo()}
          </div>
        ) : images.length > 0 ? (
          <div className="space-y-8">
            {/* Main slideshow */}
            <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden shadow-lg bg-black">
              {images.map((img, i) => (
                <div 
                  key={i}
                  className={`absolute inset-0 transition-opacity duration-1000 ${i === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="h-full w-full object-contain"
                    loading={i === 0 ? "eager" : "lazy"}
                    onError={(e) => handleImageError(i, e)}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3">
                    <p className="text-sm">{img.fileName}</p>
                  </div>
                </div>
              ))}
              
              {/* Navigation arrows */}
              <button 
                onClick={() => goToSlide((currentIndex - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="Previous image"
              >
                ❮
              </button>
              <button 
                onClick={() => goToSlide((currentIndex + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="Next image"
              >
                ❯
              </button>
              
              {/* Current image indicator */}
              <div className="absolute bottom-16 left-0 right-0 flex justify-center">
                <div className="bg-black/30 px-3 py-1 rounded-full">
                  <span className="text-white text-sm">
                    {currentIndex + 1} / {images.length}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Thumbnail navigation */}
            <div className="flex overflow-x-auto gap-2 pb-2 px-1 scrollbar-thin scrollbar-thumb-gray-400">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => goToSlide(i)}
                  className={`flex-shrink-0 h-16 w-24 rounded overflow-hidden transition-all ${i === currentIndex ? 'ring-2 ring-blue-600 scale-105' : 'opacity-70 hover:opacity-100'}`}
                >
                  <img 
                    src={img.thumbSrc} 
                    alt={`Thumbnail ${i+1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    onError={(e) => handleThumbnailError(i, e)}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p>No images found.</p>
            {renderDiagnosticInfo()}
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsGallery;

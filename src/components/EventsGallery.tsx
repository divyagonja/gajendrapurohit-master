import { useEffect, useState, useRef } from "react";
import { GalleryHorizontal, RefreshCw, ExternalLink, Youtube } from "lucide-react";
import { getEventImages, DriveImage, signIn, signOut, initOAuth, FOLDER_ID, API_KEY, clearImageCache } from "../utils/googleDriveApi";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import OptimizedImage from "./OptimizedImage";

// Define interfaces for type safety
interface PreloadResult {
  success: boolean;
  index: number;
  url?: string;
}

// Preload all images to avoid CORS issues
const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    
    // Add cache buster to URL if not already present
    const urlWithCacheBuster = url.includes('?') || url.includes('&cb=') 
      ? url 
      : `${url}${url.includes('?') ? '&' : '?'}cb=${Date.now()}`;
    
    // Add crossOrigin attribute for better caching and CORS handling
    img.crossOrigin = "anonymous";
    
    // Set a timeout to reject if image takes too long to load
    const timeout = setTimeout(() => {
      console.log(`Preload timeout for: ${url}`);
      reject();
    }, 10000); // 10 seconds timeout
    
    // Clear timeout on load/error
    img.onload = () => {
      clearTimeout(timeout);
      resolve();
    };
    
    img.onerror = () => {
      clearTimeout(timeout);
      reject();
    };
    
    // Start loading the image
    img.src = urlWithCacheBuster;
  });
};

// Add this constant at the top of the file after imports
const PLACEHOLDER_IMAGE_URL = "/placeholder-image.svg";

// Motivational talks data
const motivationalTalks = [
  {
    id: 1,
    title: "NIT RAIPUR",
    description: "Master the mindset needed to stay motivated throughout your competitive exam preparation journey.",
    image: "/images/182A4172-e1728803050785.jpg",
    youtubeUrl: "https://www.youtube.com/@gajendrapurohit",
  },
  {
    id: 2,
    title: "NIT HAMIRPUR",
    description: "Learn practical strategies to overcome math anxiety and build confidence in solving complex mathematical problems.",
    image: "/images/182A4172-e1728803050785.jpg",
    youtubeUrl: "https://www.youtube.com/@gajendrapurohit",
  },
  {
    id: 3,
    title: "NIT WARANGAL",
    description: "Develop the growth mindset that will help you achieve academic excellence and succeed in your educational journey.",
    image: "/images/182A4172-e1728803050785.jpg",
    youtubeUrl: "https://www.youtube.com/@gajendrapurohit",
  },
  {
    id: 4,
    title: "NIT TRICHY",
    description: "Discover research-backed study techniques that will maximize your learning efficiency and retention.",
    image: "/images/182A4172-e1728803050785.jpg",
    youtubeUrl: "https://www.youtube.com/@gajendrapurohit",
  },
  {
    id: 5,
    title: "NIT PATNA",
    description: "Learn how to maintain a healthy balance between academic pursuits and personal well-being for sustainable success.",
    image: "/images/182A4172-e1728803050785.jpg",
    youtubeUrl: "https://www.youtube.com/@gajendrapurohit",
  }
];

// Define IIT logos for cards
const iitLogos = [
  "/images/logos/National_Institute_of_Technology,_Raipur_Logo.png",
  "/images/logos/National_Institute_of_Technology,_Hamirpur_Logo.png",
  "/images/logos/Picture2.png",
  "/images/logos/National_Institute_of_Technology,_Tiruchirappalli.svg.png",
  "/images/logos/National_Institute_of_Technology,_Patna_Logo.png" // Using NIT Patna logo for the fifth card
];

// Fallback logo in case the primary ones fail
const FALLBACK_LOGO = "/placeholder-image.svg";

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
  const [isPaused, setIsPaused] = useState(false);

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
        throw new Error("No images were found in the folder");
      }
      
      // Store the images first so UI shows something quickly
      setImages(imagesData);
      
      // Use a more efficient preloading strategy by loading only a few critical images first
      setTimeout(async () => {
        try {
          // Just preload the first 5 images or fewer if there aren't enough
          const imagesToPreload = Math.min(5, imagesData.length);
          console.log(`EventsGallery: Preloading first ${imagesToPreload} images`);
          
          // Create preload promises for the first few images
          const preloadPromises = [];
          for (let i = 0; i < imagesToPreload; i++) {
            const image = imagesData[i];
            preloadPromises.push(
              preloadImage(image.src)
                .then(() => {
                  console.log(`Preloaded image ${i}: ${image.fileName}`);
                  return { success: true, index: i, url: image.src } as PreloadResult;
                })
                .catch(() => {
                  console.log(`Failed to preload image ${i}, trying first alternate`);
                  // Just try the first alternate URL
                  if (image.alternateUrls.length > 0) {
                    return preloadImage(image.alternateUrls[0])
                      .then(() => {
                        console.log(`Successfully loaded alternate URL for image ${i}`);
                        return { success: true, index: i, url: image.alternateUrls[0] } as PreloadResult;
                      })
                      .catch(() => ({ success: false, index: i } as PreloadResult));
                  }
                  return { success: false, index: i } as PreloadResult;
                })
            );
          }
          
          // Wait for all critical images to preload
          const results = await Promise.allSettled(preloadPromises);
          let loadedCount = 0;
          
          // Count successful loads
          results.forEach(result => {
            if (result.status === 'fulfilled' && result.value.success) {
              loadedCount++;
              
              // Update image URL if it's an alternate
              if (result.value.url && result.value.url !== imagesData[result.value.index].src) {
                setImages(currentImages => {
                  const updatedImages = [...currentImages];
                  if (updatedImages[result.value.index]) {
                    updatedImages[result.value.index].src = result.value.url!;
                  }
                  return updatedImages;
                });
              }
            }
          });
          
          setDiagnosticInfo(prev => ({ ...prev, imagesLoaded: loadedCount }));
        } catch (error) {
          console.error("Error during image preloading:", error);
        }
      }, 100);
      
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error("Error loading images:", error);
      
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
      
      // Add crossOrigin attribute for CORS issues
      target.crossOrigin = "anonymous";
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
            <li>Check folder sharing settings: Make sure the folder is shared with "Anyone with the link"</li>
            {!diagnosticInfo.folderIdSet && (
              <li className="text-red-600">Add VITE_DRIVE_FOLDER_ID to your .env file</li>
            )}
            {!diagnosticInfo.apiKeySet && (
              <li className="text-red-600">Add VITE_DRIVE_API_KEY to your .env file</li>
            )}
            <li className="mt-1">
              <a 
                href={`https://drive.google.com/drive/folders/${FOLDER_ID}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-green-600 text-white rounded text-xs flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" /> Open Folder in Drive
              </a>
            </li>
          </ul>
        </div>
      );
    }
    return null;
  };

  // When all image loading methods fail, use direct iframe embed
  const renderDirectEmbed = (fileId: string) => {
    const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    return (
      <iframe 
        src={embedUrl} 
        className="w-full h-full border-0" 
        allow="autoplay" 
        loading="lazy"
      ></iframe>
    );
  };

  return (
    <section id="events-gallery" className="py-16 bg-muted/10">
      {/* Motivational Talks Section */}
      <div className="container mx-auto px-6 mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center relative">
          Motivational Talks
          <span className="block w-20 h-1 bg-primary mx-auto mt-4"></span>
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Get inspired by Dr. Gajendra Purohit's motivational talks that help students overcome challenges and achieve academic excellence.
        </p>
        
        <div className="overflow-hidden">
          <motion.div 
            className="flex"
            animate={{
              x: isPaused ? "0%" : ["0%", "-50%"]
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 8,
                ease: "linear"
              }
            }}
            initial={false}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{ 
              willChange: "transform",
              cursor: "pointer"
            }}
          >
            {/* First set of cards */}
            <div className="flex gap-6 min-w-full">
              {motivationalTalks.map((talk, index) => (
                <Card key={`a-${talk.id}`} className="h-48 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center p-4 min-w-[200px]">
                  <div className="flex-1 flex items-center justify-center w-full mb-2">
                    <img 
                      src={iitLogos[index]} 
                      alt={`Institute ${index + 1}`} 
                      className="max-h-28 max-w-full object-contain"
                      onError={(e) => {
                        // If the image fails to load, use the fallback image
                        (e.target as HTMLImageElement).src = FALLBACK_LOGO;
                        console.log(`Failed to load logo at index ${index}, using fallback`);
                      }}
                    />
                  </div>
                  <p className="text-xs text-center font-medium text-primary-foreground bg-primary px-2 py-1 rounded-md w-full">{talk.title}</p>
                </Card>
              ))}
            </div>
            
            {/* Duplicate set for seamless loop */}
            <div className="flex gap-6 min-w-full">
              {motivationalTalks.map((talk, index) => (
                <Card key={`b-${talk.id}`} className="h-48 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center p-4 min-w-[200px]">
                  <div className="flex-1 flex items-center justify-center w-full mb-2">
                    <img 
                      src={iitLogos[index]} 
                      alt={`Institute ${index + 1}`} 
                      className="max-h-28 max-w-full object-contain"
                      onError={(e) => {
                        // If the image fails to load, use the fallback image
                        (e.target as HTMLImageElement).src = FALLBACK_LOGO;
                        console.log(`Failed to load logo at index ${index}, using fallback`);
                      }}
                    />
                  </div>
                  <p className="text-xs text-center font-medium text-primary-foreground bg-primary px-2 py-1 rounded-md w-full">{talk.title}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {error && (
        <div className="container mx-auto px-6 text-center">
          <p className="text-red-500">{error}</p>
          {!diagnosticInfo.folderIdSet && <p className="text-yellow-500">Folder ID is not set!</p>}
          {!diagnosticInfo.apiKeySet && <p className="text-yellow-500">API Key is not set!</p>}
        </div>
      )}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <GalleryHorizontal className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold">Event Photo Gallery</h2>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4">Loading event photos{retryCount > 0 ? ` (Retry ${retryCount}/3)` : ''}...</p>
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
                  {imgLoadAttempts[i] && imgLoadAttempts[i] >= 3 ? (
                    // After multiple failed attempts, use direct embed as fallback
                    renderDirectEmbed(img.fileId)
                  ) : (
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="h-full w-full object-contain"
                      loading={i === 0 || i === currentIndex || i === (currentIndex + 1) % images.length ? "eager" : "lazy"}
                      onError={(e) => handleImageError(i, e)}
                      decoding="async"
                      fetchPriority={i === currentIndex ? "high" : "low"}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      style={{ background: '#000' }} // Dark background for visibility
                    />
                  )}
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
                  aria-label={`Go to image ${i + 1}`}
                >
                  {img.fileId ? (
                    <OptimizedImage
                      fileId={img.fileId}
                      alt={`Thumbnail ${i+1}`}
                      className="h-full w-full"
                      onError={() => handleThumbnailError(i, { target: { src: PLACEHOLDER_IMAGE_URL } } as any)}
                    />
                  ) : (
                    <img 
                      src={img.thumbSrc} 
                      alt={`Thumbnail ${i+1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => handleThumbnailError(i, e)}
                    />
                  )}
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

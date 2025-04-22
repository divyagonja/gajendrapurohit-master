import { useEffect, useState, useRef } from "react";
import { GalleryHorizontal } from "lucide-react";
import { getEventImages, DriveImage } from "../utils/googleDriveApi";

const EventsGallery = () => {
  const [images, setImages] = useState<DriveImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [imgLoadAttempts, setImgLoadAttempts] = useState<Record<number, number>>({});

  useEffect(() => {
    console.log("EventsGallery: Component mounted");
    loadImages();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const loadImages = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("EventsGallery: Fetching images...");
      const imagesData = await getEventImages();
      console.log(`EventsGallery: Received ${imagesData.length} images`);
      
      if (imagesData.length === 0) {
        throw new Error("No images were loaded");
      }
      
      setImages(imagesData);
    } catch (error) {
      console.error("Error loading images:", error);
      setError("Failed to load images. Please check console for details.");
    } finally {
      setIsLoading(false);
    }
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
      target.src = `https://via.placeholder.com/800x600?text=Image+${index+1}+Not+Available`;
    }
  };

  return (
    <section id="events" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <GalleryHorizontal className="w-8 h-8 text-blue-600" />
          <h2 className="text-3xl font-bold">Event Photo Gallery</h2>
        </div>
        
        <div className="mb-4">
          <button 
            onClick={loadImages}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Reload Gallery
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4">Loading event photos...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">
            <p>{error}</p>
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
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      console.log(`EventsGallery: Thumbnail ${i} failed to load`);
                      target.src = `https://via.placeholder.com/100x100?text=${i+1}`;
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p>No images found.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsGallery;

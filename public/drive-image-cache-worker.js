// Service worker for caching Google Drive images
const CACHE_NAME = 'drive-image-cache-v1';
const GOOGLE_DRIVE_DOMAINS = [
  'lh3.googleusercontent.com',
  'drive.google.com',
  'www.googleapis.com'
];

// Install event - precache essential resources
self.addEventListener('install', (event) => {
  console.log('[Drive Image SW] Installing service worker');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Drive Image SW] Activating service worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Drive Image SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Drive Image SW] Service worker activated');
      // Claim clients to take control immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - network-first strategy for Drive images
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle requests for Google Drive domains
  if (!GOOGLE_DRIVE_DOMAINS.some(domain => url.hostname.includes(domain))) {
    return;
  }
  
  // For image requests
  if (event.request.destination === 'image' || 
      url.pathname.includes('/d/') || 
      url.pathname.includes('/thumbnail') || 
      url.pathname.includes('/uc')) {
    
    console.log('[Drive Image SW] Handling Drive image:', url.pathname);
    
    event.respondWith(
      // Try network first
      fetch(event.request)
        .then(response => {
          // Clone the response to use it and cache it
          const responseClone = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              // Add the response to cache with 1 day expiration
              cache.put(event.request, responseClone);
              console.log('[Drive Image SW] Cached Drive image:', url.pathname);
            });
          
          return response;
        })
        .catch(error => {
          console.log('[Drive Image SW] Network error, trying cache:', error);
          
          // If network fails, try from cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                console.log('[Drive Image SW] Serving from cache:', url.pathname);
                return cachedResponse;
              }
              
              // If not in cache, return error response
              console.log('[Drive Image SW] Not in cache, returning error');
              return new Response('Image not available', { status: 503 });
            });
        })
    );
  }
}); 
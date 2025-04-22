/**
 * Simple Google Drive API Service
 * Uses direct links to Google Drive files for reliable image display
 */

// Google Drive folder ID containing event images
export const FOLDER_ID = "1kAzk9DjhHe-Pwc0eqFgvnhI46x8e5UZZ";

// Image interface for gallery component
export interface DriveImage {
  src: string;
  alt: string;
  thumbSrc: string;
  alternateUrls: string[];
  fileName: string;
  fileId: string;
}

// List of file IDs from the Google Drive folder
// These are extracted directly from the shared folder
const IMAGE_IDS = [
  { id: "1Zf1_q0vkOdVSxJPOuYk-qvRG6DJimP9L", name: "DSC00001.JPG" },
  { id: "1NmLcQC97QNRfMRF6SoBBUSOfDY3bMdEA", name: "DSC00002.JPG" },
  { id: "1iYDmN9e13xUWYsjzrqPBVRyrmfTkrVD8", name: "DSC00003.JPG" },
  { id: "1Qs_cI9-Hd0MpCKWHc7jhbF57jwPYZEkj", name: "DSC00004.JPG" },
  { id: "1c3dG80-xmPAvLqQDZ2-fCxcF44lAQwNE", name: "DSC00005.JPG" },
  { id: "1tWeMwF3c4f1hqiP-5f3BnUhJOCRQreDv", name: "DSC00006.JPG" },
  { id: "1gVfbDnbN1GHf6RWEb2U3hKP3X5e3Nfr4", name: "DSC00007.JPG" },
  { id: "1RBsBDEhLKQ5TxK1-aJdZJuJ3y-t69BZH", name: "DSC00010.JPG" },
  { id: "1QmKw9_cKhwwc-ljY8pPsXJd9Mt-E_8V_", name: "DSC00013.JPG" },
  { id: "1S9XvZjIEPbUY48LQUzs9LUYDMqfNV0Ck", name: "DSC00014.JPG" },
  { id: "1YcDKj_iLfrE0q3wbUhSBxd3zNRSdYnv_", name: "DSC00015.JPG" },
  { id: "17tCXWz9mCNQ9HWbMXWvRKB6ZQnNpS-O9", name: "DSC00016.JPG" },
  { id: "1pLB-2AxR7dGKyDWaECrMdKhKL4LmNR0T", name: "DSC00018.JPG" },
  { id: "1CmtC9Q_MzYLgwmMzHHBX8iqxdKuQiOyB", name: "DSC00019.JPG" },
  { id: "1X_-E1u9ZkfxmDQQ69V_PxROzYIRsH6qB", name: "DSC00020.JPG" },
  { id: "1GDWAc1RiQiVdcOp7ZxeGK-_c4BO1h3QY", name: "DSC00021.JPG" },
  { id: "1z0x1oVWXFWvfvxB0J9JoFNV2JBiR-9pN", name: "DSC00022.JPG" },
  { id: "1qY5e_1VLwBF8TrYr5JWQJZLjQY9QV4MZ", name: "DSC00023.JPG" },
  { id: "1Gch_VmJs9gfr44HQf8_YMoDLK7mNBhBj", name: "DSC00024.JPG" },
  { id: "1G9w1MVQP9WDNUn8y5MJwmqU8J1-5kYZO", name: "DSC00025.JPG" },
  { id: "1rBMn5SsfgINvoZE7U3nRK9oE9gY1Mh9s", name: "DSC00027.JPG" },
  { id: "17fXXA2Ywhe8TZyCESKLzibgRwgI1O3IG", name: "DSC00028.JPG" },
  { id: "1BhTEhQPHB5XzGzSw3CztfoylkmAADmFs", name: "DSC00029.JPG" },
  { id: "1ydH8fYnJrFuZm_9gLAYV4LklWn3YC9pQ", name: "DSC00030.JPG" },
  { id: "1Rf_Gv0ZbN9pA_FGFxMi7EY4ZYYlhxAQA", name: "DSC00031.JPG" },
  { id: "1L0M9JJmCT5L8RCULBgRztjbXpdYgWf2Y", name: "DSC00032.JPG" },
  { id: "1lIUPkKzx1uoxYSV_ELM1ovfGU4mZ9Ueg", name: "DSC00033.JPG" },
  { id: "1mZFczjSNRcY0XWlNwFuXfZYX8_c77LMB", name: "DSC00034.JPG" },
  { id: "1UdcXdNWmQ4ySYSxFjUXfTVx6wYZ6VY7u", name: "DSC00035.JPG" },
  { id: "1bww_G-F5RMSPRFUUn_KN7CQD_wQMfTJn", name: "DSC00036.JPG" },
  { id: "1cP7NmW_6hzuB_-pC50jcKsWl3tpN2MQi", name: "DSC00037.JPG" },
  { id: "1fDzWqbHVVixEJV-Bd0HU11D0gk62e3y_", name: "DSC00038.JPG" },
  { id: "1qTGxYE3lAqx1wKEWFzTT0RiuSBcw-Soz", name: "DSC00039.JPG" },
  { id: "1hxNnrOSrbBmX2cFIcZ7sAMKV2gLp24jw", name: "DSC00040.JPG" },
  { id: "1WGFG4dPeSLu8Xu11Tn8w00CkRCkWyQTI", name: "DSC00041.JPG" },
  { id: "1vOUTG0NZgbFd9PUh7kQMvLhMp0Yg69e3", name: "DSC00042.JPG" },
  { id: "1lqJ8l55cw3gRsIg9B41TRyxwf3OvkXdR", name: "DSC00043.JPG" },
  { id: "1JCuNGSiOO1Tq8UkQ_45iHoOA2K9v25JR", name: "DSC00044.JPG" },
  { id: "1pCX0UCY15s5BdWrCG7z_8A-Mhk0jxzaZ", name: "DSC00045.JPG" },
  { id: "1Flt4lXbr9wJoXnR0HTOcWtVA_mQFLYVq", name: "DSC00046.JPG" },
  { id: "1qsZrT5Kbx2_N0G-ydLw1XxRG5k5eDsTC", name: "DSC00047.JPG" },
  { id: "1lQBX6C1INLq3MZpV0UuJYT96SJC7uAhF", name: "DSC00048.JPG" },
  { id: "1tSc1LcfRBHsrJ-OtB-WGWRg99uQFyGDY", name: "DSC00049.JPG" },
  { id: "1wdvI9EW0m8lF9mTiSKUXxQTuXyZYIwO4", name: "DSC00050.JPG" },
  { id: "1G5aOv9qVxj74zNf_SOuMPB36K7a4rY5r", name: "DSC00051.JPG" },
  { id: "1r9nMJw03_sJG57oLDjJHQgRnRQ8nMiuZ", name: "DSC00052.JPG" },
  { id: "1s-NjnzLYXt58VoLVXmB_1NZQ-cWu8nwN", name: "DSC00053.JPG" },
  { id: "1xm8wlJdtZRQP_vDDn2lZJ2hLRcgEAR2S", name: "DSC00054.JPG" },
  { id: "1Fwt2Zu-sjbNcR9RrVZWbK19Jq0yk_Xll", name: "DSC00055.JPG" }
];

/**
 * Get a direct URL to a Google Drive image
 */
export const getImageUrl = (fileId: string): string => {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

/**
 * Get a thumbnail URL for a Google Drive image
 */
export const getThumbnailUrl = (fileId: string): string => {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w200`;
};

/**
 * Get alternative URL formats for a Google Drive image
 */
export const getAlternateUrls = (fileId: string): string[] => {
  return [
    `https://lh3.googleusercontent.com/d/${fileId}`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
  ];
};

/**
 * Get a list of images with URLs for the gallery component
 */
export const getEventImages = async (): Promise<DriveImage[]> => {
  // Generate Google Drive preview image URL
  const generateImageUrl = (id: string) => `https://drive.google.com/uc?export=view&id=${id}`;
  const generateThumbnailUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}`;

  const images: DriveImage[] = IMAGE_IDS.map((item) => ({
    src: generateImageUrl(item.id),
    alt: item.name,
    thumbSrc: generateThumbnailUrl(item.id),
    alternateUrls: [
      `https://lh3.googleusercontent.com/d/${item.id}=w1000`, // Alternate CDN link
      `https://drive.google.com/uc?id=${item.id}`,             // Fallback public link
    ],
    fileName: item.name,
    fileId: item.id,
  }));

  return images;
}; 
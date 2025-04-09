import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import { analytics } from './firebase';

interface MoodboardData {
  images: string[];
  prompt: string;
  filters: {
    colorTheme: string;
    vibe: number;
    layout: string;
  };
  timestamp: number;
}

export async function saveMoodboard(userId: string, data: MoodboardData): Promise<string> {
  try {
    // Convert images to blobs
    const imageBlobs = await Promise.all(
      data.images.map(async (image) => {
        const response = await fetch(image);
        return await response.blob();
      })
    );

    // Upload images to storage
    const imageUrls = await Promise.all(
      imageBlobs.map(async (blob, index) => {
        const imageRef = ref(storage, `moodboards/${userId}/${Date.now()}_${index}.png`);
        await uploadBytes(imageRef, blob);
        return await getDownloadURL(imageRef);
      })
    );

    // Save moodboard data to storage
    const moodboardRef = ref(storage, `moodboards/${userId}/${Date.now()}_data.json`);
    const moodboardData = {
      ...data,
      images: imageUrls,
      timestamp: Date.now()
    };
    
    await uploadBytes(moodboardRef, new Blob([JSON.stringify(moodboardData)], { type: 'application/json' }));
    
    // Log analytics event
    if (analytics) {
      analytics.logEvent('moodboard_saved', {
        user_id: userId,
        timestamp: Date.now()
      });
    }

    return await getDownloadURL(moodboardRef);
  } catch (error) {
    console.error('Error saving moodboard:', error);
    throw error;
  }
}

export async function loadMoodboards(userId: string): Promise<MoodboardData[]> {
  try {
    const moodboardsRef = ref(storage, `moodboards/${userId}`);
    const result = await listAll(moodboardsRef);
    
    const moodboards = await Promise.all(
      result.items
        .filter(item => item.name.endsWith('_data.json'))
        .map(async (item) => {
          const url = await getDownloadURL(item);
          const response = await fetch(url);
          return await response.json();
        })
    );

    return moodboards.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Error loading moodboards:', error);
    throw error;
  }
}

export async function deleteMoodboard(userId: string, moodboardId: string): Promise<void> {
  try {
    const moodboardRef = ref(storage, `moodboards/${userId}/${moodboardId}`);
    await deleteObject(moodboardRef);
    
    // Log analytics event
    if (analytics) {
      analytics.logEvent('moodboard_deleted', {
        user_id: userId,
        moodboard_id: moodboardId
      });
    }
  } catch (error) {
    console.error('Error deleting moodboard:', error);
    throw error;
  }
} 
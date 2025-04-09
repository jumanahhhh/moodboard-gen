import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY);

interface ImageFilters {
  colorTheme: string;
  vibe: number;
  layout: string;
}

export async function generateImages(prompt: string, numImages: number = 4): Promise<string[]> {
  try {
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STABILITY_API_KEY}`
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1, // Stability AI only supports 1 sample at a time
        style_preset: "photographic" // Adding a style preset
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Stability AI API error details:', errorData);
      throw new Error(`Stability AI API error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    // Convert base64 images to data URLs
    return data.artifacts.map((artifact: any) => `data:image/png;base64,${artifact.base64}`);
  } catch (error) {
    console.error('Error generating images:', error);
    throw error;
  }
}

export async function regenerateImages(prompt: string, filters: ImageFilters, numImages: number = 4): Promise<string[]> {
  try {
    // Modify the prompt based on filters
    let modifiedPrompt = prompt;
    
    // Add color theme
    if (filters.colorTheme !== 'all') {
      modifiedPrompt += `, ${filters.colorTheme} color theme`;
    }
    
    // Add vibe (mood intensity)
    const vibeWords = ['subtle', 'moderate', 'strong', 'intense'];
    const vibeIndex = Math.floor(filters.vibe * (vibeWords.length - 1));
    modifiedPrompt += `, ${vibeWords[vibeIndex]} mood`;
    
    // Add layout preference
    if (filters.layout === 'organized') {
      modifiedPrompt += ', organized composition';
    } else if (filters.layout === 'balanced') {
      modifiedPrompt += ', balanced composition';
    } else {
      modifiedPrompt += ', dynamic composition';
    }

    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STABILITY_API_KEY}`
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: modifiedPrompt,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1, // Stability AI only supports 1 sample at a time
        style_preset: "photographic" // Adding a style preset
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Stability AI API error details:', errorData);
      throw new Error(`Stability AI API error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    // Convert base64 images to data URLs
    return data.artifacts.map((artifact: any) => `data:image/png;base64,${artifact.base64}`);
  } catch (error) {
    console.error('Error regenerating images:', error);
    throw error;
  }
} 
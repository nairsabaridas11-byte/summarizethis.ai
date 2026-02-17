export const fetchUrlContent = async (url: string): Promise<string> => {
  // We prepend https://r.jina.ai/
  const target = `https://r.jina.ai/${encodeURIComponent(url)}`;
  
  try {
    const response = await fetch(target);
    if (!response.ok) {
        // Fallback or specific error handling
        throw new Error(`Failed to fetch content: ${response.statusText}`);
    }
    const text = await response.text();
    
    // Basic validation: if text is too short or looks like an error page
    if (text.length < 50) {
        throw new Error("Content seems too short or invalid.");
    }
    
    return text;
  } catch (error) {
    console.error("Scraping Error:", error);
    throw error;
  }
};

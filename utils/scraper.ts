export const fetchUrlContent = async (url: string): Promise<string> => {
  // BUG FIX 10: encodeURIComponent(url) was double-encoding the URL.
  // Jina Reader's API format is simply: https://r.jina.ai/<raw-url>
  // e.g.  https://r.jina.ai/https://example.com/my-article
  // Calling encodeURIComponent turned "https://example.com" into
  // "https%3A%2F%2Fexample.com", which Jina could not resolve, always
  // returning a 404 or empty response.
  const target = `https://r.jina.ai/${url}`;
  
  try {
    const response = await fetch(target);
    if (!response.ok) {
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

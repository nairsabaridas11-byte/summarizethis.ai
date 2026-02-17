import { SummaryData, RateLimitInfo } from "../types";

const HISTORY_KEY = 'summarizethis_history';
const RATELIMIT_KEY = 'summarizethis_ratelimit';

export const getHistory = (): SummaryData[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveToHistory = (summary: SummaryData) => {
  try {
    const current = getHistory();
    // Remove duplicates based on URL
    const filtered = current.filter(item => item.url !== summary.url);
    // Add new to top, keep max 3
    const updated = [summary, ...filtered].slice(0, 3);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

// Simple client-side rate limit: 5 requests per hour
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

export const checkRateLimit = (): boolean => {
  try {
    const raw = localStorage.getItem(RATELIMIT_KEY);
    const now = Date.now();
    
    if (!raw) {
      const info: RateLimitInfo = { count: 1, firstRequestTime: now };
      localStorage.setItem(RATELIMIT_KEY, JSON.stringify(info));
      return true;
    }

    const info: RateLimitInfo = JSON.parse(raw);
    
    // Reset if window passed
    if (now - info.firstRequestTime > WINDOW_MS) {
      const newInfo: RateLimitInfo = { count: 1, firstRequestTime: now };
      localStorage.setItem(RATELIMIT_KEY, JSON.stringify(newInfo));
      return true;
    }

    // Check count
    if (info.count >= LIMIT) {
      return false;
    }

    // Increment
    info.count += 1;
    localStorage.setItem(RATELIMIT_KEY, JSON.stringify(info));
    return true;

  } catch (e) {
    // In case of error (e.g. storage disabled), allow request but log
    console.warn("Rate limit check failed", e);
    return true;
  }
};

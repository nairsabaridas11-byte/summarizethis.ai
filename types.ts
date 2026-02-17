export interface SummaryData {
  title: string;
  tldr: string;
  keyInsights: string[];
  nextSteps: string[];
  url: string;
  timestamp: number;
  originalUrl?: string; // To display clean URL
}

export interface RateLimitInfo {
  count: number;
  firstRequestTime: number;
}

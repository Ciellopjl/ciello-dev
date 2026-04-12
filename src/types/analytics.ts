export interface DeviceData {
  name: string;
  value: number;
}

export interface RecentView {
  id: string;
  page: string;
  device: string;
  createdAt: string;
}

export interface AnalyticsSummary {
  summary: {
    totalViews: number;
    viewsToday: number;
    totalClicks: number;
    clicksToday: number;
  };
  devices: DeviceData[];
  recentViews: RecentView[];
}


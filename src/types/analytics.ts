export interface ViewsData {
  date: string;
  views: number;
}

export interface DevicesData {
  name: string;
  value: number;
}

export interface LinksData {
  name: string;
  clicks: number;
}

export interface AnalyticsSummary {
  totalViews: number;
  viewsByDay: ViewsData[];
  deviceDistribution: DevicesData[];
  topLinks: LinksData[];
}

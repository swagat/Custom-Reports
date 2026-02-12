
export type MetricCategory = 'Engagement' | 'Revenue' | 'Users';

export interface Metric {
  id: string;
  label: string;
  category: MetricCategory;
}

export interface Dimension {
  id: string;
  label: string;
}

export type Operator = 'equals' | 'contains' | 'greater than' | 'less than' | 'between';

export interface Filter {
  id: string;
  field: string;
  operator: Operator;
  value: string;
  value2?: string;
}

export type VisualizationType = 'Table' | 'Line Chart' | 'Bar Chart' | 'Pie Chart';

export interface Schedule {
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  time: string;
  email: string;
  includeCsv: boolean;
}

export interface ReportConfig {
  id: string;
  name: string;
  metrics: string[];
  dimensions: string[];
  filters: Filter[];
  visualization: VisualizationType;
  rowLimit: number;
  schedule?: Schedule;
  createdAt: string;
}

export interface RawDataRecord {
  date: string;
  country: string;
  device: string;
  platform: string;
  contentTitle: string;
  subscriptionPlan: string;
  userId: string;
  revenue: number;
  views: number;
  watchDuration: number;
  users: number;
  [key: string]: string | number;
}

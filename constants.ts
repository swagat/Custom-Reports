
import { Metric, Dimension } from './types';

export const METRICS: Metric[] = [
  { id: 'views', label: 'Views', category: 'Engagement' },
  { id: 'watchDuration', label: 'Watch Duration', category: 'Engagement' },
  { id: 'avgWatchTime', label: 'Avg Watch Time', category: 'Engagement' },
  { id: 'completionRate', label: 'Completion Rate', category: 'Engagement' },
  { id: 'revenue', label: 'Total Revenue', category: 'Revenue' },
  { id: 'arpu', label: 'ARPU', category: 'Revenue' },
  { id: 'subscriptions', label: 'Subscriptions', category: 'Revenue' },
  { id: 'refunds', label: 'Refunds', category: 'Revenue' },
  { id: 'users', label: 'Active Users', category: 'Users' },
  { id: 'newUsers', label: 'New Users', category: 'Users' },
  { id: 'churnRate', label: 'Churn Rate', category: 'Users' },
];

export const DIMENSIONS: Dimension[] = [
  { id: 'date', label: 'Date' },
  { id: 'country', label: 'Country' },
  { id: 'device', label: 'Device' },
  { id: 'platform', label: 'Platform' },
  { id: 'contentTitle', label: 'Content Title' },
  { id: 'subscriptionPlan', label: 'Subscription Plan' },
  { id: 'userId', label: 'User' },
];

export const OPERATORS = [
  'equals',
  'contains',
  'greater than',
  'less than',
  'between'
];

export const VISUALIZATIONS = [
  'Table',
  'Line Chart',
  'Bar Chart',
  'Pie Chart'
];


import { RawDataRecord } from './types';

const countries = ['USA', 'UK', 'Canada', 'Germany', 'India', 'Japan', 'Brazil', 'France'];
const devices = ['Mobile', 'Desktop', 'Smart TV', 'Tablet'];
const platforms = ['iOS', 'Android', 'Web', 'Roku', 'Apple TV'];
const contentTitles = [
  'Stranger Things S4',
  'Succession S1',
  'The Bear',
  'Inception',
  'Dark Knight',
  'Office Marathon',
  'Live Sports: Final',
  'Morning News'
];
const plans = ['Free', 'Basic', 'Standard', 'Premium'];
const userIds = [
  'user_882', 'user_121', 'user_454', 'user_901', 'user_332', 
  'user_110', 'user_776', 'user_543', 'user_221', 'user_665'
];

export const generateMockData = (): RawDataRecord[] => {
  const records: RawDataRecord[] = [];
  const now = new Date();

  for (let i = 0; i < 250; i++) {
    const date = new Date();
    date.setDate(now.getDate() - Math.floor(Math.random() * 30));
    
    records.push({
      date: date.toISOString().split('T')[0],
      country: countries[Math.floor(Math.random() * countries.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      contentTitle: contentTitles[Math.floor(Math.random() * contentTitles.length)],
      subscriptionPlan: plans[Math.floor(Math.random() * plans.length)],
      userId: userIds[Math.floor(Math.random() * userIds.length)],
      revenue: parseFloat((Math.random() * 100).toFixed(2)),
      views: Math.floor(Math.random() * 1000),
      watchDuration: Math.floor(Math.random() * 5000),
      users: 1, // Individual record counts as 1 unique user in this context
    });
  }
  return records;
};

export const MOCK_DATA = generateMockData();

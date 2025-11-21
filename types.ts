export enum AppSource {
  SLACK = 'Slack',
  GMAIL = 'Gmail',
  MESSAGES = 'Messages',
  CALENDAR = 'Calendar',
  SYSTEM = 'System',
  LINKEDIN = 'LinkedIn',
  BANKING = 'Banking'
}

export interface NotificationItem {
  id: string;
  source: AppSource;
  sender: string;
  message: string;
  timestamp: Date;
  isPriority: boolean;
}

export interface UrgentItem {
  source: string;
  detail: string;
  actionRequired: string;
}

export interface CategoryStat {
  name: string;
  count: number;
}

export interface AIReport {
  summary: string;
  answerToQuery: string;
  urgentItems: UrgentItem[];
  categoryBreakdown: CategoryStat[];
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Urgent';
}

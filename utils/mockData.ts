import { NotificationItem, AppSource } from '../types';

const SENDERS = {
  [AppSource.SLACK]: ['Sarah Manager', 'DevOps Bot', 'Product Team', 'General Channel'],
  [AppSource.GMAIL]: ['Amazon', 'LinkedIn', 'Boss', 'Newsletter', 'Recruiter'],
  [AppSource.MESSAGES]: ['Mom', 'Uber', 'Bank Alert', 'Delivery Guy'],
  [AppSource.CALENDAR]: ['Meeting Reminder', 'Lunch', 'Dentist'],
  [AppSource.SYSTEM]: ['Battery Low', 'Update Available', 'Backup Complete'],
  [AppSource.LINKEDIN]: ['Recruiter', 'Connection Request', 'Job Alert'],
  [AppSource.BANKING]: ['Chase', 'Amex', 'Fraud Alert']
};

const MESSAGES = {
  [AppSource.SLACK]: [
    'Can you check the PR?',
    'Deployment failed in prod',
    'Lunch at 12?',
    'All hands meeting starting now',
    'Please update the ticket status'
  ],
  [AppSource.GMAIL]: [
    'Your package has shipped',
    'New connection request',
    'URGENT: Q3 Report needed',
    'Weekly digest',
    'Interview confirmation'
  ],
  [AppSource.MESSAGES]: [
    'Where are you?',
    'Your driver is arriving',
    'Transaction of $50.00 approved',
    'Package left at front door',
    'Call me when you can'
  ],
  [AppSource.CALENDAR]: [
    '1:1 with Manager in 10 mins',
    'Team Sync',
    'Dentist Appt tomorrow'
  ],
  [AppSource.SYSTEM]: [
    'Battery at 10%',
    'macOS Sequoia ready to install',
    'Time Machine backup finished'
  ],
  [AppSource.LINKEDIN]: [
    'someone viewed your profile',
    'New job matching your skills: Senior React Dev',
    'Congratulations on your work anniversary'
  ],
  [AppSource.BANKING]: [
    'Statement available',
    'Suspicious activity detected',
    'Payment received'
  ]
};

export const generateMockNotification = (): NotificationItem => {
  const sources = Object.values(AppSource);
  const source = sources[Math.floor(Math.random() * sources.length)];
  const senders = SENDERS[source];
  const messages = MESSAGES[source];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    source,
    sender: senders[Math.floor(Math.random() * senders.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    timestamp: new Date(),
    isPriority: Math.random() > 0.8
  };
};

export const generateInitialBatch = (count: number): NotificationItem[] => {
  return Array.from({ length: count }, generateMockNotification);
};
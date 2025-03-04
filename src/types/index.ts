
export interface CampaignData {
  id: string;
  name: string;
  subject: string;
  sender: {
    name: string;
    email: string;
  };
  replyTo?: string;
  content: {
    html: string;
    text: string;
  };
  trackingUrl: string;
  status: 'draft' | 'running' | 'completed';
  createdAt: Date;
  sentAt?: Date;
  completedAt?: Date;
  recipients: RecipientData[];
}

export interface RecipientData {
  id: string;
  email: string;
  name?: string;
  opened: boolean;
  clicked: boolean;
  openedAt?: Date;
  clickedAt?: Date;
}

export interface EmailData {
  id: string;
  campaignId: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name?: string;
    email: string;
  };
  subject: string;
  replyTo?: string;
  date: Date;
  content: {
    html: string;
    text: string;
  };
  headers: EmailHeader[];
  opened: boolean;
  clicked: boolean;
  flagged: boolean;
}

export interface EmailHeader {
  name: string;
  value: string;
  suspicious?: boolean;
  description?: string;
}

export interface SuspiciousIndicator {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  highlighted?: boolean;
}

export interface CampaignStats {
  total: number;
  sent: number;
  opened: number;
  clicked: number;
  openRate: number;
  clickRate: number;
  successRate: number; // clicked / opened
}

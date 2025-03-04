
import { v4 as uuid } from 'uuid';
import { CampaignData, CampaignStats, RecipientData } from '../types';

// Create a new campaign
export const createCampaign = (
  name: string,
  subject: string,
  senderName: string,
  senderEmail: string,
  replyTo: string | undefined,
  htmlContent: string,
  textContent: string,
  recipientEmails: string[]
): CampaignData => {
  // Create recipient entries
  const recipients: RecipientData[] = recipientEmails.map(email => ({
    id: uuid(),
    email,
    opened: false,
    clicked: false,
  }));

  // Create new campaign
  return {
    id: uuid(),
    name,
    subject,
    sender: {
      name: senderName,
      email: senderEmail,
    },
    replyTo,
    content: {
      html: htmlContent,
      text: textContent,
    },
    trackingUrl: `https://tracking.${senderEmail.split('@')[1]}/click/${uuid()}`,
    status: 'draft',
    createdAt: new Date(),
    recipients,
  };
};

// Calculate campaign statistics
export const calculateCampaignStats = (campaign: CampaignData): CampaignStats => {
  const total = campaign.recipients.length;
  const sent = campaign.status !== 'draft' ? total : 0;
  const opened = campaign.recipients.filter(r => r.opened).length;
  const clicked = campaign.recipients.filter(r => r.clicked).length;
  
  return {
    total,
    sent,
    opened,
    clicked,
    openRate: sent > 0 ? (opened / sent) * 100 : 0,
    clickRate: sent > 0 ? (clicked / sent) * 100 : 0,
    successRate: opened > 0 ? (clicked / opened) * 100 : 0,
  };
};

// Simulate sending the campaign emails
export const simulateCampaignSend = (campaign: CampaignData): CampaignData => {
  return {
    ...campaign,
    status: 'running',
    sentAt: new Date(),
  };
};

// Simulate recipient interactions (opens and clicks)
export const simulateRecipientInteractions = (
  campaign: CampaignData,
  openRate = 0.7, // 70% of recipients open the email
  clickRate = 0.4  // 40% of those who open click the link
): CampaignData => {
  const recipients = campaign.recipients.map(recipient => {
    // Simulate email opens
    const opened = Math.random() < openRate;
    
    // Simulate link clicks (only if email was opened)
    const clicked = opened && Math.random() < clickRate;
    
    return {
      ...recipient,
      opened,
      clicked,
      openedAt: opened ? new Date(Date.now() - Math.random() * 3600000) : undefined, // Random time within last hour
      clickedAt: clicked ? new Date(Date.now() - Math.random() * 1800000) : undefined, // Random time within last 30 minutes
    };
  });
  
  return {
    ...campaign,
    status: 'completed',
    completedAt: new Date(),
    recipients,
  };
};

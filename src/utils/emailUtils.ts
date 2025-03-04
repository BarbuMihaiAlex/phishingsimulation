
import { v4 as uuid } from 'uuid';
import { CampaignData, EmailData, EmailHeader, RecipientData, SuspiciousIndicator } from '../types';

// Generate a simulated email with headers based on campaign and recipient
export const generateEmail = (campaign: CampaignData, recipient: RecipientData): EmailData => {
  // Generate standard headers
  const headers = generateEmailHeaders(campaign, recipient);
  
  // Create email
  return {
    id: uuid(),
    campaignId: campaign.id,
    from: campaign.sender,
    to: {
      email: recipient.email,
      name: recipient.name,
    },
    subject: campaign.subject,
    replyTo: campaign.replyTo,
    date: new Date(),
    content: campaign.content,
    headers,
    opened: recipient.opened,
    clicked: recipient.clicked,
    flagged: false,
  };
};

// Generate realistic email headers
const generateEmailHeaders = (campaign: CampaignData, recipient: RecipientData): EmailHeader[] => {
  // Generate a flag that will be hidden in one of the headers
  const flag = "CTF{ph1sh1ng_h34d3rs_4r3_r3v34l1ng}";
  
  // Base headers
  const headers: EmailHeader[] = [
    { 
      name: "From", 
      value: `${campaign.sender.name} <${campaign.sender.email}>` 
    },
    { 
      name: "To", 
      value: recipient.name ? `${recipient.name} <${recipient.email}>` : recipient.email 
    },
    { 
      name: "Subject", 
      value: campaign.subject 
    },
    { 
      name: "Date", 
      value: new Date().toUTCString() 
    },
    { 
      name: "Message-ID", 
      value: `<${uuid()}@${campaign.sender.email.split('@')[1]}>` 
    },
    { 
      name: "MIME-Version", 
      value: "1.0" 
    },
    { 
      name: "Content-Type", 
      value: "multipart/alternative; boundary=\"boundary-string\"" 
    },
  ];

  // Add Reply-To if specified (can be suspicious if different from sender)
  if (campaign.replyTo) {
    headers.push({ 
      name: "Reply-To", 
      value: campaign.replyTo,
      suspicious: campaign.replyTo !== campaign.sender.email,
      description: "Reply-To address doesn't match the sender email, which can indicate a phishing attempt."
    });
  }

  // Add tracking headers that would be suspicious
  headers.push({ 
    name: "X-Tracking-ID", 
    value: uuid(),
    suspicious: true,
    description: "This header indicates the email contains tracking mechanisms."
  });

  // Add forged headers with suspicious content
  headers.push({ 
    name: "Return-Path", 
    value: `<bounce-${uuid()}@different-domain.com>`,
    suspicious: true,
    description: "Return-Path doesn't match the sender domain, which can indicate email spoofing."
  });

  // Add suspicious User-Agent
  headers.push({ 
    name: "User-Agent", 
    value: "PHPMailer/5.2.7 (https://github.com/PHPMailer/PHPMailer/)",
    suspicious: true,
    description: "PHPMailer is commonly used in phishing campaigns."
  });

  // Add forged SPF header
  headers.push({ 
    name: "Authentication-Results", 
    value: `mx.google.com; spf=fail (google.com: domain of ${campaign.sender.email} does not designate as permitted sender)`,
    suspicious: true,
    description: "SPF authentication failed, indicating the email didn't come from where it claims to."
  });

  // Add X-Mailer (often gives away automated tools)
  headers.push({ 
    name: "X-Mailer", 
    value: "MailChimp Transactional Email",
    suspicious: true,
    description: "This email claims to be from a legitimate service but other headers suggest otherwise."
  });

  // Add hidden flag in a custom header
  headers.push({ 
    name: "X-Security-Alert", 
    value: `This message contains tracking code: ${flag}`,
    suspicious: true,
    description: "This header contains the hidden CTF flag!"
  });

  // Add X-Priority to make email look more urgent
  headers.push({ 
    name: "X-Priority", 
    value: "1 (Highest)",
    suspicious: true,
    description: "High priority flags are often used in phishing to create urgency."
  });
  
  return headers;
};

// Analyze email headers for suspicious indicators
export const analyzeEmailHeaders = (email: EmailData): SuspiciousIndicator[] => {
  const indicators: SuspiciousIndicator[] = [];
  
  // Check for suspicious Reply-To
  const replyToHeader = email.headers.find(h => h.name === "Reply-To");
  if (replyToHeader && replyToHeader.value !== email.from.email) {
    indicators.push({
      id: uuid(),
      name: "Suspicious Reply-To",
      description: "The Reply-To address doesn't match the sender email address. This could be used to redirect replies to a different destination.",
      severity: "high",
    });
  }
  
  // Check for SPF failures
  const authResults = email.headers.find(h => h.name === "Authentication-Results");
  if (authResults && authResults.value.includes("spf=fail")) {
    indicators.push({
      id: uuid(),
      name: "SPF Authentication Failure",
      description: "The email failed SPF authentication, indicating it didn't come from the claimed sending domain.",
      severity: "high",
    });
  }
  
  // Check for suspicious mailers
  const mailerHeader = email.headers.find(h => h.name === "X-Mailer");
  if (mailerHeader && (
    mailerHeader.value.includes("PHP") || 
    mailerHeader.value.includes("MailChimp") || 
    mailerHeader.value.includes("Transactional")
  )) {
    indicators.push({
      id: uuid(),
      name: "Suspicious Mailing Software",
      description: "The email was sent using software commonly abused in phishing campaigns.",
      severity: "medium",
    });
  }
  
  // Check for tracking elements
  const trackingHeader = email.headers.find(h => h.name === "X-Tracking-ID");
  if (trackingHeader) {
    indicators.push({
      id: uuid(),
      name: "Email Tracking Detected",
      description: "This email contains tracking mechanisms to monitor when you open it.",
      severity: "medium",
    });
  }
  
  // Check for hidden flag
  const flagHeader = email.headers.find(h => h.name === "X-Security-Alert");
  if (flagHeader && flagHeader.value.includes("CTF{")) {
    indicators.push({
      id: uuid(),
      name: "Hidden Flag Detected",
      description: "This header contains a hidden CTF flag! Extract it to complete the challenge.",
      severity: "high",
      highlighted: true,
    });
  }

  // Check for urgency indicators
  const priorityHeader = email.headers.find(h => h.name === "X-Priority");
  if (priorityHeader && priorityHeader.value.includes("1")) {
    indicators.push({
      id: uuid(),
      name: "Urgency Tactics",
      description: "This email uses high priority flags to create a sense of urgency, a common phishing tactic.",
      severity: "low",
    });
  }
  
  return indicators;
};

// Find the hidden flag in email headers
export const findFlag = (email: EmailData): string | null => {
  // Search for the flag format in header values
  for (const header of email.headers) {
    const match = header.value.match(/CTF\{[^}]+\}/);
    if (match) {
      return match[0];
    }
  }
  
  // Search for the flag in email content
  const htmlContentMatch = email.content.html.match(/CTF\{[^}]+\}/);
  if (htmlContentMatch) {
    return htmlContentMatch[0];
  }
  
  return null;
};

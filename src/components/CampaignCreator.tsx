
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { createCampaign } from '@/utils/campaignUtils';
import { CampaignData } from '@/types';
import { toast } from 'sonner';
import { Code, Mail, Send, Users } from 'lucide-react';

interface CampaignCreatorProps {
  onCampaignCreated: (campaign: CampaignData) => void;
}

const CampaignCreator: React.FC<CampaignCreatorProps> = ({ onCampaignCreated }) => {
  const [activeTab, setActiveTab] = useState('email');
  const [campaignName, setCampaignName] = useState('Target Company Phishing Campaign');
  const [subject, setSubject] = useState('Urgent: Action Required - Your Account Access');
  const [senderName, setSenderName] = useState('IT Security Team');
  const [senderEmail, setSenderEmail] = useState('security@companylookalike.com');
  const [replyTo, setReplyTo] = useState('support@different-domain.com');
  
  const [htmlContent, setHtmlContent] = useState(`
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding-bottom: 20px; }
    .logo { max-width: 150px; }
    .button { background-color: #0056b3; color: white; padding: 10px 20px; 
              text-decoration: none; border-radius: 4px; display: inline-block; }
    .footer { font-size: 12px; color: #666; margin-top: 30px; }
    /* Hidden flag comment: CTF{1nsp3ct_th3_html_c0mm3nts} */
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://company-logo.com/logo.png" alt="Company Logo" class="logo">
      <h2>Important Security Notice</h2>
    </div>
    
    <p>Dear Valued Employee,</p>
    
    <p>Our security systems have detected unusual login activity on your account. 
       For your protection, we need you to verify your account details immediately.</p>
    
    <p>If you don't verify within 24 hours, your account access will be suspended.</p>
    
    <p style="text-align: center; margin: 30px 0;">
      <a href="##TRACKING_URL##" class="button">Verify Account Now</a>
    </p>
    
    <p>If you didn't request this verification, please contact the IT department immediately.</p>
    
    <p>Thank you,<br>
       IT Security Team</p>
    
    <div class="footer">
      <p>This is an automated message, please do not reply directly to this email.</p>
    </div>
  </div>
</body>
</html>
  `);
  
  const [textContent, setTextContent] = useState(`
IMPORTANT SECURITY NOTICE

Dear Valued Employee,

Our security systems have detected unusual login activity on your account. 
For your protection, we need you to verify your account details immediately.

If you don't verify within 24 hours, your account access will be suspended.

Please visit: ##TRACKING_URL##

If you didn't request this verification, please contact the IT department immediately.

Thank you,
IT Security Team

This is an automated message, please do not reply directly to this email.
  `);
  
  const [recipientEmails, setRecipientEmails] = useState('user1@target.com\nuser2@target.com\nuser3@target.com\nuser4@target.com\nuser5@target.com');
  
  const handleCreateCampaign = () => {
    if (!campaignName || !subject || !senderName || !senderEmail || !htmlContent || !textContent || !recipientEmails) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Process recipients
    const emailList = recipientEmails
      .split('\n')
      .map(email => email.trim())
      .filter(email => email);
      
    if (emailList.length === 0) {
      toast.error('Please add at least one recipient email');
      return;
    }
    
    // Create campaign
    const newCampaign = createCampaign(
      campaignName,
      subject,
      senderName,
      senderEmail,
      replyTo,
      htmlContent,
      textContent,
      emailList
    );
    
    onCampaignCreated(newCampaign);
    toast.success('Campaign created successfully!');
  };
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Create Phishing Campaign
        </CardTitle>
        <CardDescription>
          Configure your simulated phishing campaign details
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Email Details</span>
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Email Content</span>
            </TabsTrigger>
            <TabsTrigger value="recipients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Recipients</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-6">
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter campaign name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sender-name">Sender Name</Label>
                <Input
                  id="sender-name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Enter sender name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sender-email">Sender Email</Label>
                <Input
                  id="sender-email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="Enter sender email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reply-to">Reply-To Email (Optional)</Label>
              <Input
                id="reply-to"
                value={replyTo}
                onChange={(e) => setReplyTo(e.target.value)}
                placeholder="Enter reply-to email"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="html-content">HTML Content</Label>
              <Textarea
                id="html-content"
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="Enter HTML content"
                className="h-[300px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Use ##TRACKING_URL## as a placeholder for the tracking link
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="text-content">Text Content</Label>
              <Textarea
                id="text-content"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter plain text content"
                className="h-[150px] font-mono text-sm"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="recipients" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipients">
                Recipients (one email per line)
              </Label>
              <Textarea
                id="recipients"
                value={recipientEmails}
                onChange={(e) => setRecipientEmails(e.target.value)}
                placeholder="Enter recipient emails, one per line"
                className="h-[200px] font-mono text-sm"
              />
            </div>
          </TabsContent>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              if (activeTab === 'email') {
                // We're already at the first tab
              } else if (activeTab === 'content') {
                setActiveTab('email');
              } else if (activeTab === 'recipients') {
                setActiveTab('content');
              }
            }}
            disabled={activeTab === 'email'}
          >
            Previous
          </Button>
          
          {activeTab !== 'recipients' ? (
            <Button 
              onClick={() => {
                if (activeTab === 'email') {
                  setActiveTab('content');
                } else if (activeTab === 'content') {
                  setActiveTab('recipients');
                }
              }}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleCreateCampaign}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Create Campaign
            </Button>
          )}
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default CampaignCreator;


import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import EmailList from '@/components/EmailList';
import EmailViewer from '@/components/EmailViewer';
import { generateEmail } from '@/utils/emailUtils';
import { EmailData } from '@/types';
import { useLocation } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Inbox, Search, ShieldAlert } from 'lucide-react';
import { useCampaignStore } from '@/store/campaignStore';
import { toast } from 'sonner';

const EmailAnalysis = () => {
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailData | null>(null);
  const location = useLocation();
  const { currentCampaign, setCurrentCampaign } = useCampaignStore();
  
  // Check for campaign data in both location state and store
  useEffect(() => {
    console.log("Location state:", location.state);
    console.log("Current campaign in store:", currentCampaign);
    
    const campaignFromLocation = location.state?.campaign;
    
    if (campaignFromLocation) {
      console.log("Found campaign in location state, generating emails...");
      // Save to store for persistence
      setCurrentCampaign(campaignFromLocation);
      
      // Generate emails from campaign recipients
      const generatedEmails = campaignFromLocation.recipients.map(recipient => 
        generateEmail(campaignFromLocation, recipient)
      );
      setEmails(generatedEmails);
      
      // Select the first email if available
      if (generatedEmails.length > 0) {
        setSelectedEmail(generatedEmails[0]);
        toast.success(`${generatedEmails.length} emails intercepted from campaign "${campaignFromLocation.name}"`);
      }
    } else if (currentCampaign) {
      console.log("Using campaign from store, generating emails...");
      // Use campaign from store if available
      const generatedEmails = currentCampaign.recipients.map(recipient => 
        generateEmail(currentCampaign, recipient)
      );
      setEmails(generatedEmails);
      
      // Select the first email if available
      if (generatedEmails.length > 0 && !selectedEmail) {
        setSelectedEmail(generatedEmails[0]);
      }
    }
  }, [location.state, currentCampaign, setCurrentCampaign]);
  
  const handleSelectEmail = (email: EmailData) => {
    setSelectedEmail(email);
  };
  
  const handleFlagEmail = (emailId: string, flagged: boolean) => {
    // Update flagged status in emails list
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, flagged } : email
    ));
    
    // Update selected email if it's the one being flagged
    if (selectedEmail && selectedEmail.id === emailId) {
      setSelectedEmail({ ...selectedEmail, flagged });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container py-6 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldAlert className="h-8 w-8" />
            Email Interception Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Analyze intercepted phishing emails and inspect headers
          </p>
        </div>
        
        {emails.length === 0 ? (
          <Alert className="bg-muted border-muted-foreground/20">
            <Search className="h-4 w-4" />
            <AlertTitle>No emails intercepted yet</AlertTitle>
            <AlertDescription>
              Create and run a campaign in the Campaign Dashboard to see intercepted emails here.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <EmailList 
              emails={emails} 
              selectedEmail={selectedEmail} 
              onSelectEmail={handleSelectEmail} 
            />
            
            <EmailViewer 
              email={selectedEmail} 
              onFlagEmail={handleFlagEmail} 
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default EmailAnalysis;

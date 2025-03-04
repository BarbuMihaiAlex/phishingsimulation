
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CampaignData } from '@/types';
import { simulateCampaignSend, simulateRecipientInteractions } from '@/utils/campaignUtils';
import CampaignCreator from '@/components/CampaignCreator';
import CampaignMetrics from '@/components/CampaignMetrics';
import Navigation from '@/components/Navigation';
import { AlertCircle, BarChart2, Mail, Play, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CampaignDashboard = () => {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const navigate = useNavigate();
  
  const handleCampaignCreated = (newCampaign: CampaignData) => {
    setCampaign(newCampaign);
  };
  
  const handleStartCampaign = async () => {
    if (!campaign) return;
    
    setIsSimulating(true);
    toast.info('Starting campaign simulation...');
    
    // First update to "running" status
    const runningCampaign = simulateCampaignSend(campaign);
    setCampaign(runningCampaign);
    
    // Wait a bit to simulate sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate recipient interactions over time
    const completedCampaign = simulateRecipientInteractions(runningCampaign);
    setCampaign(completedCampaign);
    
    toast.success('Campaign completed! Check the Email Analysis dashboard to view intercepted emails.');
    setIsSimulating(false);
  };
  
  const handleResetCampaign = () => {
    setCampaign(null);
    toast.info('Campaign reset');
  };
  
  const handleViewEmails = () => {
    if (campaign && campaign.status === 'completed') {
      navigate('/analysis', { state: { campaign } });
    } else {
      toast.error('Please complete the campaign first to view emails');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container py-6 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <BarChart2 className="h-8 w-8" />
              Phishing Campaign Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage simulated phishing campaigns
            </p>
          </div>
          
          {campaign && (
            <div className="flex items-center gap-2">
              {campaign.status === 'draft' && (
                <Button 
                  onClick={handleStartCampaign} 
                  disabled={isSimulating}
                  className="flex items-center gap-2"
                >
                  {isSimulating ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {isSimulating ? 'Simulating...' : 'Start Campaign'}
                </Button>
              )}
              {campaign.status === 'completed' && (
                <Button
                  onClick={handleViewEmails}
                  className="flex items-center gap-2"
                  variant="secondary"
                >
                  <Mail className="h-4 w-4" />
                  View Intercepted Emails
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={handleResetCampaign}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          )}
        </div>
        
        {campaign ? (
          <div className="space-y-8">
            <div className="bg-muted/50 border rounded-lg p-4 flex items-center gap-4">
              <div className={`rounded-full p-2 ${
                campaign.status === 'draft' 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' 
                  : campaign.status === 'running' 
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
              }`}>
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Campaign Status: <span className="capitalize">{campaign.status}</span></h3>
                <p className="text-sm text-muted-foreground">
                  {campaign.status === 'draft' 
                    ? 'Ready to simulate sending emails to targets' 
                    : campaign.status === 'running' 
                    ? 'Campaign is currently running'
                    : 'Campaign completed. View results below or check the Email Analysis dashboard'}
                </p>
              </div>
            </div>
            
            <CampaignMetrics campaign={campaign} />
            
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-4 py-3 border-b">
                <h3 className="font-medium flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Recipients
                </h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {campaign.recipients.map((recipient) => (
                    <div key={recipient.id} className="border rounded-md p-3 text-sm">
                      <div className="font-medium">{recipient.email}</div>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                          recipient.opened 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {recipient.opened ? 'Opened' : 'Not opened'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                          recipient.clicked 
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {recipient.clicked ? 'Clicked' : 'Not clicked'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <CampaignCreator onCampaignCreated={handleCampaignCreated} />
        )}
      </main>
    </div>
  );
};

export default CampaignDashboard;

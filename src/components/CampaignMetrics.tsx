
import React from 'react';
import { CampaignData, CampaignStats } from '@/types';
import { calculateCampaignStats } from '@/utils/campaignUtils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BadgeCheck, Mail, MousePointer, UsersRound } from 'lucide-react';

interface CampaignMetricsProps {
  campaign: CampaignData;
}

const CampaignMetrics: React.FC<CampaignMetricsProps> = ({ campaign }) => {
  const stats: CampaignStats = calculateCampaignStats(campaign);
  
  // Format as percentage with 1 decimal place
  const formatPercent = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full animate-fade-in">
      <MetricCard
        title="Recipients"
        value={stats.total.toString()}
        description="Total targets"
        icon={<UsersRound className="h-5 w-5 text-blue-500" />}
      />
      
      <MetricCard
        title="Open Rate"
        value={formatPercent(stats.openRate)}
        description={`${stats.opened} of ${stats.sent} emails opened`}
        progress={stats.openRate}
        icon={<Mail className="h-5 w-5 text-green-500" />}
      />
      
      <MetricCard
        title="Click Rate"
        value={formatPercent(stats.clickRate)}
        description={`${stats.clicked} of ${stats.sent} links clicked`}
        progress={stats.clickRate}
        icon={<MousePointer className="h-5 w-5 text-yellow-500" />}
      />
      
      <MetricCard
        title="Success Rate"
        value={formatPercent(stats.successRate)}
        description={`${stats.clicked} of ${stats.opened} opened emails clicked`}
        progress={stats.successRate}
        icon={<BadgeCheck className="h-5 w-5 text-red-500" />}
      />
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  progress?: number;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  progress,
  icon,
}) => {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription>{description}</CardDescription>
        {progress !== undefined && (
          <Progress
            value={progress}
            className="h-2 mt-3"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignMetrics;

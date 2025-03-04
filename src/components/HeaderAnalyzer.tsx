
import React, { useState, useEffect } from 'react';
import { EmailData, EmailHeader, SuspiciousIndicator } from '@/types';
import { analyzeEmailHeaders } from '@/utils/emailUtils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AlertTriangle, Flag, Info, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

interface HeaderAnalyzerProps {
  email: EmailData;
  onFlagEmail: (emailId: string, flagged: boolean) => void;
}

const HeaderAnalyzer: React.FC<HeaderAnalyzerProps> = ({ 
  email, 
  onFlagEmail 
}) => {
  const [suspiciousIndicators, setSuspiciousIndicators] = useState<SuspiciousIndicator[]>([]);
  
  useEffect(() => {
    const indicators = analyzeEmailHeaders(email);
    setSuspiciousIndicators(indicators);
  }, [email]);
  
  const handleFlagEmail = () => {
    onFlagEmail(email.id, !email.flagged);
    if (!email.flagged) {
      toast.success('Email flagged as suspicious');
    } else {
      toast.info('Flag removed from email');
    }
  };
  
  // Function to get severity badge color
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-900/50';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50';
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
      default:
        return '';
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Indicators section */}
      <div className="border rounded-md p-4 bg-muted/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500" />
            Suspicious Indicators
          </h3>
          <Button
            variant={email.flagged ? "destructive" : "outline"}
            size="sm"
            onClick={handleFlagEmail}
            className="flex items-center gap-2"
          >
            <Flag className="h-4 w-4" />
            {email.flagged ? "Remove Flag" : "Flag as Suspicious"}
          </Button>
        </div>
        
        {suspiciousIndicators.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Info className="h-8 w-8 mx-auto opacity-50 mb-2" />
            <p>No suspicious indicators detected</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {suspiciousIndicators.map((indicator) => (
              <li 
                key={indicator.id} 
                className={cn(
                  "rounded-md border p-3 flex justify-between",
                  indicator.highlighted ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/50 animate-pulse" : "bg-card"
                )}
              >
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {indicator.highlighted ? (
                      <Flag className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    )}
                    {indicator.name}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {indicator.description}
                  </p>
                </div>
                <Badge 
                  variant="outline" 
                  className={cn("ml-2 self-start", getSeverityColor(indicator.severity))}
                >
                  {indicator.severity}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Email headers section */}
      <div className="border rounded-md">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="headers">
            <AccordionTrigger className="px-4">
              Email Headers
            </AccordionTrigger>
            <AccordionContent className="pt-2 px-0">
              <div className="overflow-auto max-h-[300px]">
                {email.headers.map((header, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={cn(
                          "header-row px-4",
                          header.suspicious && "suspicious"
                        )}>
                          <div className="font-medium truncate">
                            {header.name}
                          </div>
                          <div className="truncate font-mono text-xs overflow-hidden">
                            {header.value}
                          </div>
                        </div>
                      </TooltipTrigger>
                      {header.suspicious && header.description && (
                        <TooltipContent className="custom-tooltip">
                          <p>{header.description}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default HeaderAnalyzer;

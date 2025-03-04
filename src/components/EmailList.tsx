
import React from 'react';
import { EmailData } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  CheckCircle2, 
  Clock, 
  FileWarning,
  Flag, 
  Mail, 
  MousePointer 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EmailListProps {
  emails: EmailData[];
  selectedEmail: EmailData | null;
  onSelectEmail: (email: EmailData) => void;
}

const EmailList: React.FC<EmailListProps> = ({
  emails,
  selectedEmail,
  onSelectEmail,
}) => {
  return (
    <div className="rounded-md border border-border overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">From</TableHead>
            <TableHead className="w-[180px]">To</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="w-[120px] text-center">Status</TableHead>
            <TableHead className="w-[80px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emails.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <Mail className="h-8 w-8 opacity-50" />
                  <p>No emails captured yet</p>
                  <p className="text-sm">Start a campaign to see intercepted emails</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            emails.map((email) => (
              <TableRow 
                key={email.id}
                className={cn(
                  "cursor-pointer transition-colors",
                  selectedEmail?.id === email.id && "bg-muted",
                )}
                onClick={() => onSelectEmail(email)}
              >
                <TableCell>
                  <div className="font-medium truncate max-w-[180px]">
                    {email.from.name}
                  </div>
                  <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {email.from.email}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="truncate max-w-[180px]">
                    {email.to.name || email.to.email}
                  </div>
                  {email.to.name && (
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {email.to.email}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="truncate">{email.subject}</div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-1">
                    {email.opened && (
                      <Badge variant="outline" className="flex items-center gap-1 border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
                        <Mail className="h-3 w-3" />
                        <span className="text-xs">Opened</span>
                      </Badge>
                    )}
                    {email.clicked && (
                      <Badge variant="outline" className="flex items-center gap-1 border-yellow-200 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-900">
                        <MousePointer className="h-3 w-3" />
                        <span className="text-xs">Clicked</span>
                      </Badge>
                    )}
                    {email.flagged && (
                      <Badge variant="outline" className="flex items-center gap-1 border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900">
                        <Flag className="h-3 w-3" />
                        <span className="text-xs">Flagged</span>
                      </Badge>
                    )}
                    {!email.opened && !email.clicked && !email.flagged && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">Pending</span>
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEmail(email);
                    }}
                  >
                    <FileWarning className="h-4 w-4" />
                    <span className="sr-only">Analyze</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmailList;

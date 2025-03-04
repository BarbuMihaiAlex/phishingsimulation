
import React, { useState } from 'react';
import { EmailData } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { findFlag } from '@/utils/emailUtils';
import { Code, Flag, Mail, Search } from 'lucide-react';
import HeaderAnalyzer from './HeaderAnalyzer';

interface EmailViewerProps {
  email: EmailData | null;
  onFlagEmail: (emailId: string, flagged: boolean) => void;
}

const EmailViewer: React.FC<EmailViewerProps> = ({ email, onFlagEmail }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [flag, setFlag] = useState<string | null>(null);

  // If email changes, check for flag
  React.useEffect(() => {
    if (email) {
      const foundFlag = findFlag(email);
      setFlag(foundFlag);
    } else {
      setFlag(null);
    }
  }, [email]);

  if (!email) {
    return (
      <Card className="w-full h-[500px] flex items-center justify-center animate-fade-in">
        <div className="text-center text-muted-foreground flex flex-col items-center gap-3">
          <Search className="h-12 w-12 opacity-30" />
          <div>
            <CardTitle className="mb-2">No Email Selected</CardTitle>
            <CardDescription>
              Select an email from the list to analyze it
            </CardDescription>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader className="flex flex-row items-baseline justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {email.subject}
          </CardTitle>
          <CardDescription className="mt-1">
            From {email.from.name} &lt;{email.from.email}&gt; to {email.to.email}
          </CardDescription>
        </div>
        {flag && (
          <Alert className="ml-auto w-fit p-3 bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400 animate-pulse">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              <AlertDescription className="font-mono">{flag}</AlertDescription>
            </div>
          </Alert>
        )}
      </CardHeader>

      <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Email Preview</span>
            </TabsTrigger>
            <TabsTrigger value="headers" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span>Headers Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="source" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>Source Code</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-6">
          <TabsContent value="preview" className="mt-0">
            <div className="border rounded-md bg-card">
              <div className="p-4 border-b bg-muted/50">
                <div className="grid grid-cols-[auto_1fr] gap-2">
                  <div className="font-medium">From:</div>
                  <div>
                    {email.from.name} &lt;{email.from.email}&gt;
                  </div>

                  <div className="font-medium">To:</div>
                  <div>{email.to.email}</div>

                  <div className="font-medium">Subject:</div>
                  <div>{email.subject}</div>

                  {email.replyTo && (
                    <>
                      <div className="font-medium">Reply-To:</div>
                      <div>{email.replyTo}</div>
                    </>
                  )}

                  <div className="font-medium">Date:</div>
                  <div>{email.date.toLocaleString()}</div>
                </div>
              </div>
              <div className="p-6 overflow-auto max-h-[500px] bg-white dark:bg-black">
                <iframe 
                  srcDoc={email.content.html}
                  title="Email Preview"
                  className="w-full min-h-[400px] border-0"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="headers" className="mt-0">
            <HeaderAnalyzer email={email} onFlagEmail={onFlagEmail} />
          </TabsContent>

          <TabsContent value="source" className="mt-0">
            <div className="border rounded-md overflow-auto max-h-[500px]">
              <pre className="p-4 text-xs font-mono whitespace-pre-wrap bg-muted/30">
                {`From: ${email.from.name} <${email.from.email}>
To: ${email.to.email}
Subject: ${email.subject}
Date: ${email.date.toUTCString()}
${email.replyTo ? `Reply-To: ${email.replyTo}\n` : ''}
${email.headers.map(header => `${header.name}: ${header.value}`).join('\n')}

${email.content.text}
`}
              </pre>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default EmailViewer;

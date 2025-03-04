
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { AlertTriangle, BarChart, Mail, Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="py-24 px-6 md:px-12 flex flex-col items-center text-center">
          <div className="animate-slide-down">
            <div className="bg-primary/10 p-4 rounded-full w-fit mx-auto mb-6">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Phishing Simulation & Analysis Platform
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Learn to identify and analyze phishing attacks through hands-on simulations
              and email header analysis in this educational CTF challenge.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="flex items-center gap-2">
                <Link to="/campaign">
                  <BarChart className="h-5 w-5" />
                  Campaign Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
                <Link to="/analysis">
                  <Mail className="h-5 w-5" />
                  Email Analysis
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-24 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<BarChart className="h-12 w-12 text-primary" />}
                title="Create Campaigns"
                description="Set up simulated phishing emails with customizable templates, sender information, and tracking links."
              />
              
              <FeatureCard
                icon={<AlertTriangle className="h-12 w-12 text-yellow-500" />}
                title="Simulate Attacks"
                description="Send simulated phishing emails to targets and monitor open and click-through rates."
              />
              
              <FeatureCard
                icon={<Mail className="h-12 w-12 text-red-500" />}
                title="Analyze Headers"
                description="Inspect email headers to identify suspicious indicators and uncover hidden flags."
              />
            </div>
          </div>
        </section>
        
        <section className="py-12 md:py-24">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Test Your Skills?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start by creating a phishing campaign, then analyze the intercepted emails to find the hidden flag.
              </p>
              
              <Button asChild size="lg">
                <Link to="/campaign">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground">
            This is an educational platform for learning about phishing detection and analysis.
          </p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-card rounded-lg p-6 border transition-all hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;

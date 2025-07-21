
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Crown, Zap } from 'lucide-react';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ open, onOpenChange }) => {
  const handleUpgrade = (plan: string) => {
    // Mock upgrade logic
    console.log(`Upgrading to ${plan} plan`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Upgrade Your Plan</DialogTitle>
          <p className="text-center text-muted-foreground">
            You've reached your daily free limit. Choose a plan to continue improving your communication skills.
          </p>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Card className="border-2 border-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-primary mr-2" />
                <h3 className="text-xl font-bold">Pro Plan</h3>
              </div>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>60 minutes daily</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>Advanced AI feedback</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>Progress analytics</span>
                </li>
              </ul>
              <Button 
                onClick={() => handleUpgrade('pro')} 
                className="w-full"
              >
                Choose Pro
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-yellow-500 mr-2" />
                <h3 className="text-xl font-bold">Premium Plan</h3>
              </div>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold">$19.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>Unlimited usage</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>Custom AI agents</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button 
                onClick={() => handleUpgrade('premium')} 
                className="w-full bg-yellow-500 hover:bg-yellow-600"
              >
                Choose Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

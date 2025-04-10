
import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

export function SuccessDialog({ open, onClose, message }: SuccessDialogProps) {
  useEffect(() => {
    if (open) {
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
        <div className="flex flex-col items-center p-6">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          <h2 className="text-xl font-semibold text-center mb-6">{message}</h2>
          <Button 
            onClick={onClose}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

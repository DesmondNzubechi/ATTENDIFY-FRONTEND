
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface AddSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSessionAdded: (session: any) => void;
}

export function AddSessionDialog({ open, onOpenChange, onSessionAdded }: AddSessionDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    sessionName: '',
    startDate: '',
    endDate: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.sessionName.trim()) {
      newErrors.sessionName = 'Session name is required';
    }
    
    if (!formData.startDate.trim()) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate.trim()) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && formData.endDate && 
              new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSessionAdded(formData);
      onOpenChange(false);
      setFormData({
        sessionName: '',
        startDate: '',
        endDate: ''
      });
    } else {
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Academic Session</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="sessionName" className="text-sm font-medium">
                Session Name
              </label>
              <Input
                id="sessionName"
                name="sessionName"
                placeholder="e.g., 2024/2025"
                value={formData.sessionName}
                onChange={handleChange}
                className={errors.sessionName ? "border-red-500" : ""}
              />
              {errors.sessionName && (
                <p className="text-xs text-red-500">{errors.sessionName}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="startDate" className="text-sm font-medium">
                Start Date
              </label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className={errors.startDate ? "border-red-500" : ""}
              />
              {errors.startDate && (
                <p className="text-xs text-red-500">{errors.startDate}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="endDate" className="text-sm font-medium">
                End Date
              </label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className={errors.endDate ? "border-red-500" : ""}
              />
              {errors.endDate && (
                <p className="text-xs text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Session</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

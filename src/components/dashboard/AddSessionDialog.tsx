
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
    name: '',
    start: '',
    end: ''
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Session name is required';
    }
    
    if (!formData.start.trim()) {
      newErrors.start = 'Start date is required';
    }
    
    if (!formData.end.trim()) {
      newErrors.end = 'End date is required';
    } else if (formData.start && formData.end && 
              new Date(formData.end) <= new Date(formData.start)) {
      newErrors.end = 'End date must be after start date';
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
        name: '',
        start: '',
        end: ''
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
              <label htmlFor="name" className="text-sm font-medium">
                Session Name
              </label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., 2024/2025"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="start" className="text-sm font-medium">
                Start Date
              </label>
              <Input
                id="start"
                name="start"
                type="date"
                value={formData.start}
                onChange={handleChange}
                className={errors.start ? "border-red-500" : ""}
              />
              {errors.start && (
                <p className="text-xs text-red-500">{errors.start}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="end" className="text-sm font-medium">
                End Date
              </label>
              <Input
                id="end"
                name="end"
                type="date"
                value={formData.end}
                onChange={handleChange}
                className={errors.end ? "border-red-500" : ""}
              />
              {errors.end && (
                <p className="text-xs text-red-500">{errors.end}</p>
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


import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseAdded: (course: any) => void;
}

export function AddCourseDialog({ open, onOpenChange, onCourseAdded }: AddCourseDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    courseName: '',
    courseCode: '',
    description: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    
    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Course name is required';
    }
    
    if (!formData.courseCode.trim()) {
      newErrors.courseCode = 'Course code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCourseAdded(formData);
      onOpenChange(false);
      setFormData({
        courseName: '',
        courseCode: '',
        description: ''
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
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="courseName" className="text-sm font-medium">
                Course Name
              </label>
              <Input
                id="courseName"
                name="courseName"
                placeholder="e.g., Introduction to Computer Science"
                value={formData.courseName}
                onChange={handleChange}
                className={errors.courseName ? "border-red-500" : ""}
              />
              {errors.courseName && (
                <p className="text-xs text-red-500">{errors.courseName}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="courseCode" className="text-sm font-medium">
                Course Code
              </label>
              <Input
                id="courseCode"
                name="courseCode"
                placeholder="e.g., CSC101"
                value={formData.courseCode}
                onChange={handleChange}
                className={errors.courseCode ? "border-red-500" : ""}
              />
              {errors.courseCode && (
                <p className="text-xs text-red-500">{errors.courseCode}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Course Description
              </label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter course description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Course</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

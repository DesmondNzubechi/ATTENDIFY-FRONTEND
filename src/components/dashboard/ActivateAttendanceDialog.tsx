
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ActivateAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAttendanceActivated: (data: any) => void;
  courses: { id: string; name: string }[];
  sessions: { id: string; name: string }[];
}

export function ActivateAttendanceDialog({ 
  open, 
  onOpenChange, 
  onAttendanceActivated,
  courses,
  sessions
}: ActivateAttendanceDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    courseId: '',
    sessionId: '',
    level: '',
    semester: 'First Semester'
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user makes a selection
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.courseId) {
      newErrors.courseId = 'Course is required';
    }
    
    if (!formData.sessionId) {
      newErrors.sessionId = 'Academic Session is required';
    }
    
    if (!formData.level) {
      newErrors.level = 'Level is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAttendanceActivated(formData);
      onOpenChange(false);
      setFormData({
        courseId: '',
        sessionId: '',
        level: '',
        semester: 'First Semester'
      });
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Activate Attendance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <label htmlFor="courseId" className="text-sm font-medium">
              Course
            </label>
            <Select 
              onValueChange={(value) => handleChange('courseId', value)}
              value={formData.courseId}
            >
              <SelectTrigger className={errors.courseId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.courseId && (
              <p className="text-xs text-red-500">{errors.courseId}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="sessionId" className="text-sm font-medium">
              Academic Session
            </label>
            <Select 
              onValueChange={(value) => handleChange('sessionId', value)}
              value={formData.sessionId}
            >
              <SelectTrigger className={errors.sessionId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map(session => (
                  <SelectItem key={session.id} value={session.id}>
                    {session.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sessionId && (
              <p className="text-xs text-red-500">{errors.sessionId}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="level" className="text-sm font-medium">
              Level
            </label>
            <Select 
              onValueChange={(value) => handleChange('level', value)}
              value={formData.level}
            >
              <SelectTrigger className={errors.level ? "border-red-500" : ""}>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
                <SelectItem value="300">300</SelectItem>
                <SelectItem value="400">400</SelectItem>
              </SelectContent>
            </Select>
            {errors.level && (
              <p className="text-xs text-red-500">{errors.level}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="semester" className="text-sm font-medium">
              Semester
            </label>
            <Select 
              onValueChange={(value) => handleChange('semester', value)}
              value={formData.semester}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="First Semester">First Semester</SelectItem>
                <SelectItem value="Second Semester">Second Semester</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Activate Attendance</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

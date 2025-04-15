
import React from 'react';
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Lecturer } from '@/stores/useLecturersStore';

interface ViewLecturerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lecturer: Lecturer | null;
}

export function ViewLecturerDialog({ 
  open, 
  onOpenChange, 
  lecturer 
}: ViewLecturerDialogProps) {
  if (!lecturer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lecturer Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
            <img src={lecturer.avatar} alt={lecturer.name} className="object-cover" />
          </Avatar>
          <h3 className="text-xl font-semibold">{lecturer.name}</h3>
          <p className="text-sm text-muted-foreground">{lecturer.email}</p>
        </div>
        <Separator />
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-1">
            <p className="text-sm font-medium">Faculty:</p>
            <p className="text-sm">{lecturer.faculty}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="text-sm font-medium">Department:</p>
            <p className="text-sm">{lecturer.department}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <p className="text-sm font-medium">ID:</p>
            <p className="text-sm">{lecturer.id}</p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

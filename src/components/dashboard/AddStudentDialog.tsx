
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  regNo: z.string().min(6, {
    message: "Registration number must be at least 6 characters.",
  }),
  level: z.string().min(2, {
    message: "level must be at least 2 characters.",
  }),
  addmissionYear: z.string().min(2, {
    message: "You have not included the addmission year.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStudentAdded: (student: FormValues) => void;
}

export function AddStudentDialog({ 
  open, 
  onOpenChange,
  onStudentAdded
}: AddStudentDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      regNo: "",
      level: "",
      addmissionYear: ""
    },
  });

  function onSubmit(values: FormValues) {
    // Generate a unique ID
    const newStudent = {
      ...values,
    };
    
    onStudentAdded(newStudent);
    form.reset();
    onOpenChange(false);
    
    toast({
      title: "Student Added Successfully!",
      description: "The student has been added to the system.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-w-[350px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Add New Student</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder="Enter last name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="regNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder="e.g. P7345H3234" {...field} />
                  </FormControl> 
                </FormItem>
              )}
            />

            <FormField 
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder="e.g. 200" {...field} />
                  </FormControl>
                </FormItem>


              )}
            />
             <FormField 
              control={form.control}
              name="addmissionYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Of Addmission</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder="e.g. 2020" {...field} />
                  </FormControl>
                </FormItem>


              )}
            />

            <DialogFooter className="mt-6 gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                <X size={16} className="mr-2" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Check size={16} className="mr-2" />
                Add Student
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

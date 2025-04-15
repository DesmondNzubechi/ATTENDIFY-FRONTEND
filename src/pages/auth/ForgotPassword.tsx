
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/api/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      await authService.forgotPassword(email);
      setIsSuccess(true);
      toast({
        title: "Success",
        description: "If an account with that email exists, we've sent instructions to reset your password"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
 
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            {!isSuccess 
              ? "Enter your email address and we'll send you instructions to reset your password" 
              : "We've sent password reset instructions to your email"
            }
          </CardDescription>
        </CardHeader>
        {!isSuccess ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Instructions...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Instructions
                  </>
                )}
              </Button>
              <Link to="/login" className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-gray-600">
              We've sent password reset instructions to {email}. Please check your inbox.
            </p>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => {
                setEmail('');
                setIsSuccess(false);
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Send to another email
            </Button>
            <Link to="/login" className="flex justify-center text-sm text-blue-600 hover:text-blue-800 mt-2">
              Back to Login
            </Link>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';

import { registerSchema, type RegisterFormValues } from '@/lib/validations/auth';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: '',
      dob: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange', // Validate on change for immediate feedback
  });
  
  // Monitor password strength
  const watchPassword = form.watch('password');
  
  useEffect(() => {
    if (!watchPassword) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    // Add 25 points for length
    if (watchPassword.length >= 8) strength += 25;
    // Add 25 points for having numbers
    if (/\d/.test(watchPassword)) strength += 25;
    // Add 25 points for having lowercase
    if (/[a-z]/.test(watchPassword)) strength += 25;
    // Add 25 points for having uppercase or special chars
    if (/[A-Z]/.test(watchPassword) || /[^A-Za-z0-9]/.test(watchPassword)) strength += 25;
    
    setPasswordStrength(strength);
  }, [watchPassword]);
  
  const formatPhoneNumber = (value: string) => {
    // Strip non-digits
    const digits = value.replace(/\D/g, '');
    // Format as XXX-XXX-XXXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);
    try {
      const registrationData = {
        ...data,
        name: `${data.firstName} ${data.lastName}`,
        // Format phone to consistent format for database
        phone: data.phone.replace(/\D/g, ''),
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Registration failed');

      const signInResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (signInResult?.error) throw new Error(signInResult.error);

      toast({ title: 'Registration successful!', description: "You've been signed in automatically." });
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleOAuthSignIn = (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    signIn(provider, { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="rounded-md shadow-md w-full max-w-5xl mx-auto p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="hidden md:flex flex-col justify-center items-center bg-blue-900 text-white p-10">
            <h2 className="text-3xl font-semibold mb-4">Find Jobs, Hire Talent—Fast, Easy And Reliable.</h2>
            <p className="text-lg font-bold">Start Today!</p>
            <div className="mt-10">
              <img src="/phone-illustration.svg" alt="Phone illustration" className="w-48" />
            </div>
          </div>
          
          <div className="p-4">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl text-center">Start Your Career Journey With Us, <br /> <span className="text-primary">REGISTER NOW</span></CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-6 md:gap-y-5">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl><Input placeholder="Enter your First Name" {...field} disabled={isLoading} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl><Input placeholder="Enter your Last Name" {...field} disabled={isLoading} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField 
                    control={form.control} 
                    name="phone" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="XXX-XXX-XXXX" 
                            {...field} 
                            value={formatPhoneNumber(field.value)}
                            onChange={(e) => {
                              const formatted = formatPhoneNumber(e.target.value);
                              field.onChange(formatted);
                            }}
                            disabled={isLoading} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="Enter your Email" {...field} disabled={isLoading} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="dob" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          disabled={isLoading}
                          max={new Date().toISOString().split('T')[0]} // Prevent future dates
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter your Password" 
                            {...field} 
                            disabled={isLoading} 
                          />
                        </FormControl>
                        <button 
                          type="button" 
                          className="absolute right-3 top-2.5 text-gray-500" 
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                      </div>
                      {watchPassword && (
                        <div className="mt-2 space-y-1">
                          <Progress value={passwordStrength} className="h-1" />
                          <div className="text-xs grid grid-cols-2 gap-1">
                            <div className="flex items-center">
                              {watchPassword.length >= 8 ? <FaCheck className="text-green-500 mr-1" /> : <FaTimes className="text-red-500 mr-1" />}
                              <span>Min 8 characters</span>
                            </div>
                            <div className="flex items-center">
                              {/\d/.test(watchPassword) ? <FaCheck className="text-green-500 mr-1" /> : <FaTimes className="text-red-500 mr-1" />}
                              <span>Contains number</span>
                            </div>
                            <div className="flex items-center">
                              {/[a-z]/.test(watchPassword) ? <FaCheck className="text-green-500 mr-1" /> : <FaTimes className="text-red-500 mr-1" />}
                              <span>Lowercase letter</span>
                            </div>
                            <div className="flex items-center">
                              {/[A-Z]/.test(watchPassword) || /[^A-Za-z0-9]/.test(watchPassword) ? 
                                <FaCheck className="text-green-500 mr-1" /> : <FaTimes className="text-red-500 mr-1" />}
                              <span>Uppercase or symbol</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm your Password" 
                            {...field} 
                            disabled={isLoading} 
                          />
                        </FormControl>
                        <button 
                          type="button" 
                          className="absolute right-3 top-2.5 text-gray-500" 
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="col-span-full flex items-center space-x-2">
                    <input type="checkbox" id="terms" className="accent-primary" required />
                    <label htmlFor="terms" className="text-sm">I have agree to the <span className="text-blue-600">Terms & Conditions</span></label>
                  </div>
                  <Button type="submit" className="w-full col-span-full" disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'REGISTER'}
                  </Button>
                </form>
              </Form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR CONTINUE WITH</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" disabled={isLoading} onClick={() => handleOAuthSignIn('google')}>
                  <FaGoogle className="mr-2 h-4 w-4" /> Google
                </Button>
                <Button variant="outline" type="button" disabled={isLoading} onClick={() => handleOAuthSignIn('facebook')}>
                  <FaFacebook className="mr-2 h-4 w-4" /> Facebook
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary font-semibold hover:underline">Login Here</Link>
              </p>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  );
}


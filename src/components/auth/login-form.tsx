'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { loginSchema, type LoginFormValues } from '@/lib/validations/auth';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur', // Validate on blur for better user experience
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setAuthError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Use a generic error message instead of exposing server errors
        setAuthError("Invalid email or password. Please try again.");
        toast({
          title: 'Login failed',
          description: "Invalid email or password. Please try again.",
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Login successful!',
        description: "You've been signed in.",
      });

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      // Generic error message instead of exposing error details
      setAuthError("Something went wrong. Please try again later.");
      toast({
        title: 'Login failed',
        description: "Something went wrong. Please try again later.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleOAuthSignIn = (provider: 'google' | 'azure-ad') => {
    setIsLoading(true);
    setAuthError(null);
    signIn(provider, {
      callbackUrl: '/dashboard',
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden grid md:grid-cols-2 w-full max-w-[1100px]">
        {/* Left Panel */}
        <div className="bg-lightest p-10 flex flex-col justify-center text-white space-y-4">
          <h2 className="text-2xl tracking-wider font-bold text-white">WELCOME TO FINDWORKS</h2>
          <p className="text-xl font-[550] text-darker">Reliable Workers. Fair Wages. <br/> Trusted Connections.</p>
          <p className="text-lg tracking-wider font-semibold text-white">Sign In To Get Started!</p>
          <div className="flex justify-center mt-4">
            <img
              src="/login-vector.svg"
              alt="Illustration"
              className="w-5/6"
            />
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="p-10">
          <h2 className="text-2xl font-semibold text-center mb-8 text-darker">LOGIN</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-darker'>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your Email"
                        {...field}
                        disabled={isLoading}
                        autoComplete="email"
                        className='text-darker/80'
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-darker'>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your Password"
                          {...field}
                          disabled={isLoading}
                          className="pr-10 text-darker/80"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 8 characters
                    </p>
                  </FormItem>
                )}
              />
              {authError && (
                <p className="text-sm text-red-500">
                  {authError}
                </p>
              )}
              <div className="flex text-darker items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="form-checkbox" />
                  <span>Remember Me?</span>
                </label>
                <Link href="#" className="text-darker hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Button type="submit" className="w-full tracking-wider bg-light hover:bg-lightest hover:text-darker" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'LOGIN'}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm text-gray-500">
              <span className="bg-white text-xs px-2">OR CONTINUE WITH</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('google')}
              className="w-1/2 flex items-center bg-light hover:bg-lightest hover:text-darker justify-center gap-2"
            >
              <FaGoogle />
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('azure-ad')}
              className="w-1/2 flex items-center bg-light hover:bg-lightest hover:text-darker justify-center gap-2"
            >
              <FaMicrosoft />
              Microsoft
            </Button>
          </div>

          <p className="text-sm text-darker text-center mt-6">
            Don’t have an account?{' '}
            <Link href="/auth/register" className="text-light tracking-wide font-[550] hover:underline">
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

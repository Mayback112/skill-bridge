import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email').endsWith('@upsa.edu.gh', 'Must be a UPSA email (@upsa.edu.gh)'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

import { authService } from '@/api';

export default function GraduateRegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.graduateRegister({
        fullName: data.fullName,
        email: data.email,
        password: data.password
      });

      if (response.data.success) {
        toast.success('Registration successful! Please check your UPSA email to verify your account.');
        navigate('/auth/graduate/login');
      }
    } catch (error: any) {
      console.error('Registration Error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="p-6 border-b">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="bg-blue-600 p-2 rounded-xl">
            <GraduationCap className="text-white h-6 w-6" />
          </div>
          <span className="text-xl font-bold">SKILLBRIDGE GH</span>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center p-6 bg-muted/20">
        <div className="w-full max-w-md bg-background p-10 rounded-[2.5rem] border shadow-xl">
          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">UPSA graduates only</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              {...register('fullName')}
              error={errors.fullName?.message}
            />
            <Input
              label="UPSA Email"
              placeholder="student@upsa.edu.gh"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword')}
              error={errors.confirmPassword?.message}
            />

            <Button type="submit" className="w-full rounded-2xl h-12 mt-4" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/auth/graduate/login" className="text-blue-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

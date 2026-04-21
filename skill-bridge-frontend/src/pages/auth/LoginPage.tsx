import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        console.log('Login successful, user role:', user.role);
        login(token, user);
        toast.success(`Welcome back, ${user.fullName}!`);
        
        // Role-based redirection
        if (user.role === 'ADMIN') {
          console.log('Redirecting admin to /admin/dashboard');
          navigate('/admin/dashboard');
        } else if (user.role === 'GRADUATE') {
          console.log('Redirecting graduate, profile complete:', user.isProfileComplete);
          if (!user.isProfileComplete) {
            navigate('/onboarding/method');
          } else {
            console.log('Redirecting to /graduate/dashboard');
            navigate('/graduate/dashboard');
          }
        } else if (user.role === 'EMPLOYER') {
          console.log('Redirecting employer to /dashboard/employer');
          navigate('/dashboard/employer');
        }
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
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
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Login to your account to continue</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              placeholder="Enter your email"
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

            <Button type="submit" className="w-full rounded-2xl h-12 mt-4" isLoading={isLoading}>
              Login
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Graduate looking for an account?{' '}
            <Link to="/auth/graduate/register" className="text-blue-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

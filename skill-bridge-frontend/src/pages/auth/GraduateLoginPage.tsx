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

const loginSchema = z.object({
  email: z.string().email('Invalid email').endsWith('@upsa.edu.gh', 'Must be a UPSA email (@upsa.edu.gh)'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function GraduateLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      console.log('Logging in:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: '1',
        email: data.email,
        fullName: 'Test Graduate',
        role: 'GRADUATE' as const,
        isProfileComplete: false
      };
      
      login('mock-jwt-token', mockUser);
      toast.success('Welcome back!');
      
      if (!mockUser.isProfileComplete) {
        navigate('/onboarding/method');
      } else {
        navigate('/dashboard/graduate');
      }
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
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
          <h1 className="text-3xl font-bold mb-8">Welcome back</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <Button type="submit" className="w-full rounded-2xl h-12 mt-4" isLoading={isLoading}>
              Login
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/auth/graduate/register" className="text-blue-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

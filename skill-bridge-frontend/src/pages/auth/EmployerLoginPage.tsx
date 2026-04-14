import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';

export default function EmployerLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth Delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockEmployer = {
        id: 'emp-1',
        email: 'hiring@company.com',
        fullName: 'Hiring Manager',
        role: 'EMPLOYER' as const,
      };
      
      login('mock-jwt-token', mockEmployer);
      toast.success('Signed in with Google successfully!');
      navigate('/dashboard/employer');
    } catch (error) {
      toast.error('Google sign-in failed');
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
        <div className="w-full max-w-md bg-background p-10 rounded-[2.5rem] border shadow-xl text-center">
          <h1 className="text-3xl font-bold mb-2">Employer Login</h1>
          <p className="text-muted-foreground mb-10">Sign in with your Gmail account to continue</p>

          <Button 
            onClick={handleGoogleLogin} 
            variant="outline" 
            className="w-full rounded-2xl h-14 border-2 flex gap-3 text-lg"
            isLoading={isLoading}
          >
            {!isLoading && (
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            Continue with Google
          </Button>

          <p className="mt-8 text-sm text-muted-foreground">
            Looking for a job?{' '}
            <Link to="/auth/graduate/register" className="text-blue-600 font-semibold hover:underline">
              Register as a Graduate
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

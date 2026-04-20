import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/api';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');

      if (token) {
        try {
          // Temporarily store token to fetch user info
          localStorage.setItem('token', token);
          
          const response = await authService.getCurrentUser();
          if (response.data.success) {
            const user = response.data.data;
            login(token, user);
            toast.success('Login successful!');
            
            // Redirect based on role
            if (user.role === 'EMPLOYER') {
              navigate('/dashboard/employer');
            } else if (user.role === 'ADMIN') {
              navigate('/dashboard/admin');
            } else {
              navigate('/dashboard/graduate');
            }
          }
        } catch (error) {
          console.error('OAuth2 Callback Error:', error);
          localStorage.removeItem('token');
          toast.error('Failed to complete login. Please try again.');
          navigate('/auth/employer/login');
        }
      } else {
        toast.error('No authentication token received.');
        navigate('/auth/employer/login');
      }
    };

    handleCallback();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-muted/20">
      <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-6" />
      <h1 className="text-2xl font-bold">Completing login...</h1>
      <p className="text-muted-foreground">Please wait while we finalize your session.</p>
    </div>
  );
}

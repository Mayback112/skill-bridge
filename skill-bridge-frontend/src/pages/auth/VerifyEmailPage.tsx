import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { authService } from '@/api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failure'>('loading');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('failure');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        if (response.data.success) {
          setStatus('success');
        } else {
          setStatus('failure');
        }
      } catch (error) {
        console.error('Verification Error:', error);
        setStatus('failure');
      }
    };
    verify();
  }, [searchParams]);

  useEffect(() => {
    let timer: any;
    if (status === 'success' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (status === 'success' && countdown === 0) {
      navigate('/auth/graduate/login');
    }
    return () => clearInterval(timer);
  }, [status, countdown, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-md bg-background/80 backdrop-blur-xl p-12 rounded-[3rem] border shadow-2xl text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
            <div className="relative">
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
              <div className="absolute inset-0 h-16 w-16 bg-blue-600/20 rounded-full animate-ping" />
            </div>
            <h1 className="text-2xl font-bold">Verifying your email...</h1>
            <p className="text-muted-foreground">Please wait while we activate your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-500">
            <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-2">
              <CheckCircle className="h-14 w-14" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight">Email Verified!</h1>
              <p className="text-muted-foreground text-lg px-2">
                Your account is now active. You can now log in to access the portal.
              </p>
            </div>
            
            <div className="w-full space-y-4 pt-4">
              <Link to="/auth/graduate/login" className="block w-full">
                <Button className="w-full rounded-2xl h-14 text-lg group">
                  Go to Login
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Redirecting you automatically in <span className="font-bold text-blue-600 tabular-nums">{countdown}</span> seconds...
              </p>
            </div>
          </div>
        )}

        {status === 'failure' && (
          <div className="flex flex-col items-center gap-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="h-24 w-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
              <XCircle className="h-14 w-14" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight">Verification Failed</h1>
              <p className="text-muted-foreground text-lg px-2">
                The link is either expired, invalid, or has already been used.
              </p>
            </div>
            
            <div className="w-full space-y-4 pt-4">
              <Button variant="outline" className="w-full rounded-2xl h-14 text-lg">
                Resend verification email
              </Button>
              <Link to="/auth/graduate/register" className="text-sm text-blue-600 font-semibold hover:underline">
                Return to Registration
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

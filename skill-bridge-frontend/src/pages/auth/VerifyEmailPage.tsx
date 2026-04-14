import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/common/Button';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failure'>('loading');

  useEffect(() => {
    const verify = async () => {
      // Simulate API verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      const token = searchParams.get('token');
      if (token === 'fail') {
        setStatus('failure');
      } else {
        setStatus('success');
      }
    };
    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/20">
      <div className="w-full max-w-md bg-background p-12 rounded-[3rem] border shadow-2xl text-center">
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-6">
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            <h1 className="text-2xl font-bold">Verifying your email...</h1>
            <p className="text-muted-foreground">Please wait while we activate your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-6">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold">Verified!</h1>
            <p className="text-muted-foreground text-lg">Your UPSA email has been successfully verified.</p>
            <Link to="/auth/graduate/login" className="w-full mt-4">
              <Button className="w-full rounded-2xl h-14 text-lg">Go to Login</Button>
            </Link>
          </div>
        )}

        {status === 'failure' && (
          <div className="flex flex-col items-center gap-6">
            <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center text-red-600">
              <XCircle className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold">Verification Failed</h1>
            <p className="text-muted-foreground text-lg">The link is either expired or invalid.</p>
            <Button variant="outline" className="w-full rounded-2xl h-14 text-lg mt-4">
              Resend verification email
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

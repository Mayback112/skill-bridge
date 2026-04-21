import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import NavGraduate from '@/components/graduate/nav_graduate';
import NavEmployer from '@/components/employer/nav_employer';
import NavAdmin from '@/components/admin/nav_admin';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Menu } from 'lucide-react';
import { Button } from '@/components/common/Button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // Pages that should NOT have a side nav even when authenticated
  const isCleanPage = location.pathname === '/' ||
                      location.pathname === '/graduates' || 
                      location.pathname.startsWith('/graduates/') ||
                      location.pathname === '/jobs' ||
                      location.pathname.startsWith('/review/');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/10">
        <nav className="flex items-center justify-between px-6 h-20 border-b bg-background sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <GraduationCap className="text-white h-6 w-6" />
            </div>
            <span className="font-bold text-xl tracking-tight">SKILLBRIDGE GH</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <span className="text-xs text-muted-foreground font-medium">Initializing...</span>
          </div>
        </nav>
        {children}
      </div>
    );
  }

  if (isAuthenticated && !isCleanPage) {
    if (user?.role === 'EMPLOYER') return <NavEmployer>{children}</NavEmployer>;
    if (user?.role === 'GRADUATE') return <NavGraduate>{children}</NavGraduate>;
    if (user?.role === 'ADMIN') return <NavAdmin>{children}</NavAdmin>;
  }

  const isOnboarding = location.pathname.startsWith('/onboarding');
  const step = location.pathname === '/onboarding/method' ? '1 of 2' 
             : location.pathname === '/onboarding/linkedin' ? '1 of 2'
             : location.pathname === '/onboarding/manual' ? '2 of 2'
             : null;

  const getBackPath = () => {
    if (user?.role === 'EMPLOYER') return '/dashboard/employer';
    if (user?.role === 'GRADUATE') return '/graduate/dashboard';
    if (user?.role === 'ADMIN') return '/admin/dashboard';
    return '/';
  };
  
  return (
    <div className="min-h-screen bg-muted/10">
      <nav className="flex items-center justify-between px-6 h-20 border-b bg-background sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {!isOnboarding && (
             <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
                   <Menu className="h-6 w-6" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="w-72 p-0">
                 <SheetHeader className="p-6 border-b text-left">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="bg-blue-600 p-1.5 rounded-lg">
                        <GraduationCap className="text-white h-5 w-5" />
                      </div>
                      <span className="font-bold text-lg">SkillBridge</span>
                    </SheetTitle>
                 </SheetHeader>
                 <div className="p-4 space-y-2">
                    <Link to="/graduates" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium hover:bg-muted transition-all">
                      Graduates
                    </Link>
                    <Link to="/jobs" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl font-medium hover:bg-muted transition-all">
                      Jobs
                    </Link>
                    <div className="pt-4 mt-4 border-t">
                      {!isAuthenticated ? (
                        <Link to="/auth/graduate/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full rounded-2xl">Login / Register</Button>
                        </Link>
                      ) : (
                        <Link to={getBackPath()} onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full rounded-2xl">Go to Dashboard</Button>
                        </Link>
                      )}
                    </div>
                 </div>
               </SheetContent>
             </Sheet>
          )}

          {isAuthenticated && isCleanPage && (
            <Link to={getBackPath()}>
              <Button variant="ghost" size="sm" className="rounded-xl hidden sm:flex gap-2 font-bold text-blue-600">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl sm:hidden text-blue-600">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl hidden xs:flex">
              <GraduationCap className="text-white h-6 w-6" />
            </div>
            <span className="font-bold text-lg xs:text-xl tracking-tight">SKILLBRIDGE GH</span>
          </Link>
        </div>
        
        {isOnboarding && step ? (
          <span className="text-sm font-medium text-muted-foreground">Step {step}</span>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/graduates" className="text-sm font-medium hover:text-blue-600 transition-colors hidden md:block">Graduates</Link>
            <Link to="/jobs" className="text-sm font-medium hover:text-blue-600 transition-colors hidden md:block">Jobs</Link>
            {!isAuthenticated ? (
              <Link to="/auth/graduate/login" className="hidden xs:block">
                <Button variant="outline" className="rounded-2xl">Login</Button>
              </Link>
            ) : (
              <Link to={getBackPath()} className="hidden xs:block">
                <Button className="rounded-2xl px-6">Dashboard</Button>
              </Link>
            )}
          </div>
        )}
      </nav>
      {children}
    </div>
  );
};

export default UserLayout;

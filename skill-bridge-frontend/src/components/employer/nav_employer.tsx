import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { GraduationCap, LogOut, Layout, Users, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { MobileSidebar } from '../common/MobileSidebar';

interface NavEmployerProps {
  children: React.ReactNode;
}

export default function NavEmployer({ children }: NavEmployerProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard/employer', icon: <Layout className="h-5 w-5" /> },
    { label: 'Browse Graduates', path: '/graduates', icon: <Users className="h-5 w-5" /> },
    { label: 'Post a Job', path: '/dashboard/employer/post-job', icon: <PlusCircle className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col">
      <nav className="h-16 border-b bg-background px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <MobileSidebar navItems={navItems} roleName="EMPLOYER" />
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="font-bold uppercase tracking-wider hidden xs:inline-block">SkillBridge</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium hidden sm:inline-block">{user?.fullName}</span>
          <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl hidden md:flex">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <div className="flex-1 flex">
        <aside className="w-64 border-r bg-background hidden md:flex flex-col p-4 gap-2">
          {navItems.map(item => (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
                isActive(item.path) 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </aside>

        <main className="flex-1 p-4 md:p-10 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

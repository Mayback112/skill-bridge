import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, Layout, User, BookOpen, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { MobileSidebar } from '../common/MobileSidebar';

interface NavGraduateProps {
  children: React.ReactNode;
}

const NavGraduate: React.FC<NavGraduateProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navItems = [
    { label: 'Dashboard', path: '/graduate/dashboard', icon: <Layout className="h-5 w-5" /> },
    { label: 'Profile', path: user?.id ? `/graduate/profile/${user.id}` : '/graduate/profile', icon: <User className="h-5 w-5" /> },
    { label: 'Courses', path: '/graduate/courses', icon: <BookOpen className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col font-sans">
      <nav className="h-16 border-b bg-background px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <MobileSidebar navItems={navItems} roleName="GRADUATE" />
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="font-bold hidden xs:inline-block">SKILLBRIDGE</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium hidden sm:inline-block">{user?.fullName}</span>
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-blue-600">
            {user?.fullName?.charAt(0)}
          </div>
          <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl hidden md:flex">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <div className="flex-1 flex">
        <aside className="w-64 border-r bg-background hidden md:flex flex-col p-4 gap-2">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
              isActive(item.path) 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-muted-foreground hover:bg-muted'
            }`}>
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
};

export default NavGraduate;
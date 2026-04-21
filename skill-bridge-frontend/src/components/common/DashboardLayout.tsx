import { GraduationCap, LogOut, Layout, User, BookOpen, Settings, Briefcase, Users, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  roleName: string;
}

export const DashboardLayout = ({ children, navItems, roleName }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col font-sans">
      <nav className="h-16 border-b bg-background px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="font-bold uppercase tracking-widest text-sm">
            {roleName === 'ADMIN' ? 'SkillBridge Admin' : 'SKILLBRIDGE'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium hidden sm:inline-block">{user?.fullName}</span>
          <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      <div className="flex-1 flex">
        <aside className="w-64 border-r bg-background hidden md:flex flex-col p-4 gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition-all ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </aside>

        <main className="flex-1 p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

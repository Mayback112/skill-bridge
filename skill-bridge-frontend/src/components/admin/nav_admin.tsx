import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Briefcase, BookOpen, ShieldCheck, Layout, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { MobileSidebar } from '../common/MobileSidebar';

interface NavAdminProps {
  children: React.ReactNode;
}

const NavAdmin: React.FC<NavAdminProps> = ({ children }) => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: <Layout className="h-5 w-5" /> },
    { label: 'Graduates', path: '/admin/graduates', icon: <Users className="h-5 w-5" /> },
    { label: 'Jobs', path: '/admin/jobs', icon: <Briefcase className="h-5 w-5" /> },
    { label: 'Courses', path: '/admin/courses', icon: <BookOpen className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="h-16 border-b bg-background px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <MobileSidebar navItems={navItems} roleName="ADMIN" />
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-red-600" />
            <span className="font-bold uppercase tracking-widest text-xs xs:text-sm">Admin Panel</span>
          </Link>
        </div>
        <Button variant="ghost" onClick={logout} className="rounded-xl font-bold text-red-600 hidden md:flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </nav>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-background hidden lg:flex flex-col p-6 gap-4">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-4 mb-2">Management</p>
          {navItems.map(item => (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all text-left ${
              isActive(item.path)
                ? 'bg-zinc-100 dark:bg-zinc-800'
                : 'text-muted-foreground hover:bg-muted'
            }`}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </aside>

        <main className="flex-1 p-4 md:p-12 w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default NavAdmin;
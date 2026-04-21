import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, LogOut, GraduationCap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface MobileSidebarProps {
  navItems: NavItem[];
  roleName: string;
}

export const MobileSidebar = ({ navItems, roleName }: MobileSidebarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden rounded-xl">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        <SheetHeader className="p-6 border-b text-left">
          <SheetTitle className="flex items-center gap-2">
            {roleName === 'ADMIN' ? (
              <ShieldCheck className="h-6 w-6 text-red-600" />
            ) : (
              <GraduationCap className="h-6 w-6 text-blue-600" />
            )}
            <span className="font-bold text-lg">
              {roleName === 'ADMIN' ? 'Admin Panel' : 'SkillBridge'}
            </span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
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
        </div>

        <div className="p-6 border-t mt-auto">
          <div className="flex items-center gap-3 mb-6 px-2">
             <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border-2 border-blue-600">
                {user?.fullName?.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold truncate max-w-[150px]">{user?.fullName}</span>
                <span className="text-xs text-muted-foreground">{user?.role}</span>
              </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700" 
            onClick={() => {
              setOpen(false);
              logout();
            }}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

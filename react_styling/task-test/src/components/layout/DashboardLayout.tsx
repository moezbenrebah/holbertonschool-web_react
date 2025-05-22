// Updated DashboardLayout.tsx with profile link in dropdown
import React, { ReactNode, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart2,
  Activity,
  Wind,
  Brain,
  BookOpen,
  Settings,
  Menu,
  X,
  User,
  LogOut,
  Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/components/context/AuthContext';
import { toast } from '@/components/ui/sonner';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  
  const navItems = [
    { name: 'Dashboard', icon: <Activity className="h-5 w-5" />, path: '/app' },
    { name: 'Learn About Stress', icon: <BookOpen className="h-5 w-5" />, path: '/app/stress-education' },
    { name: 'Stress Tracking', icon: <BarChart2 className="h-5 w-5" />, path: '/app/stress' },
    { name: 'Breathing Exercises', icon: <Wind className="h-5 w-5" />, path: '/app/breathing' },
    { name: 'Meditation', icon: <Brain className="h-5 w-5" />, path: '/app/meditation' },
    { name: 'Relaxation Music', icon: <Music className="h-5 w-5" />, path: '/app/music' },
  ];
  
  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    navigate('/');
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.name) return 'MF'; // Default: MindFlow
    
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
  };
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="px-4 py-5 flex items-center justify-between border-b">
            <Link to="/" className="flex items-center gap-2">
              <div className="rounded-full overflow-hidden border-2 border-primary/20 p-1 bg-white">
                <img 
                  src="/lovable-uploads/4546c2ea-9a15-40c9-a1ec-f046c06e8245.png" 
                  alt="Mindflow Logo" 
                  className="h-8 w-8 object-contain rounded-full"
                />
              </div>
              <span className="font-semibold text-lg text-gray-800">Mindflow</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-gray-700 hover:bg-primary/10"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          {/* Profile section */}
          <div className="p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-start gap-2 px-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/20 text-primary">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">{user?.name || 'User'}</span>
                    <span className="text-muted-foreground text-xs">{user?.email || 'user@example.com'}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/app/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/app/profile?tab=security')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="lg:hidden flex-1 flex justify-center">
              <div className="rounded-full overflow-hidden border-2 border-primary/20 p-1 bg-white">
                <img
                  src="/lovable-uploads/4546c2ea-9a15-40c9-a1ec-f046c06e8245.png"
                  alt="Mindflow Logo"
                  className="h-6 w-6 object-contain rounded-full"
                />
              </div>
            </div>
            
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-gray-800">
                {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => navigate('/app/profile?tab=security')}>
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
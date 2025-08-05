import { LayoutDashboard, FileText, Radio, LogOut, Clock } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';

const navigation = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Notes', url: '/notes', icon: FileText },
  { title: 'Dispatch', url: '/dispatch', icon: Radio },
];

export function CADSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { logout, user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/20 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-accent/10 text-foreground/80 hover:text-foreground";

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} border-r border-border bg-card`}>
      <SidebarContent className="bg-card">
        {/* Header Section */}
        <div className="p-4 border-b border-border">
          {!collapsed && (
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-primary">CAD System</h2>
              <div className="text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {currentTime.toLocaleTimeString()}
                </div>
                <div className="mt-1">
                  User: {user?.username}
                </div>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="text-center">
              <Clock className="w-5 h-5 text-primary mx-auto" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClassName}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sign Out Button */}
        <div className="mt-auto p-4 border-t border-border">
          <Button
            onClick={logout}
            variant="outline"
            size={collapsed ? "icon" : "default"}
            className="w-full border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
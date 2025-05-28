
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  LineChart, 
  Settings, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Users, label: "Students", href: "/students" },
    { icon: Trophy, label: "Achievements", href: "/achievements" },
    { icon: LineChart, label: "Reports", href: "/reports" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  return (
    <aside 
      className={cn(
        "bg-sidebar border-r-2 border-sidebar-border h-screen transition-all duration-300 ease-in-out shadow-lg",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={cn(
          "flex items-center p-4 h-16 border-b-2 border-sidebar-border",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center border-2 border-primary/20">
                <span className="text-primary-foreground font-bold">SA</span>
              </div>
              <h1 className="text-lg font-bold text-sidebar-foreground">StudentAchieve</h1>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center border-2 border-primary/20">
              <span className="text-primary-foreground font-bold">SA</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "p-1.5 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-sidebar-border transition-colors",
              collapsed ? "mx-auto" : ""
            )}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 pt-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== "/" && location.pathname.startsWith(item.href));
                
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-3 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors border border-transparent hover:border-sidebar-border",
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-sidebar-border" : "text-sidebar-foreground",
                      collapsed ? "justify-center" : "gap-3"
                    )}
                  >
                    <item.icon size={collapsed ? 22 : 18} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        {!collapsed && (
          <div className="p-4 border-t-2 border-sidebar-border mt-auto">
            <div className="flex items-center gap-3 p-2 rounded-lg border border-sidebar-border bg-sidebar-accent/50">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium border-2 border-border">
                AD
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">admin@college.edu</p>
              </div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="p-4 border-t-2 border-sidebar-border mt-auto flex justify-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium border-2 border-border">
              AD
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

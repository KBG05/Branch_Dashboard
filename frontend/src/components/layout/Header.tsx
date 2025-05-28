
import React, { useState } from "react";
import { Bell, User, Search, ChevronDown, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const Header = () => {
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-background border-b-2 border-border h-16 px-6 flex items-center justify-between shadow-sm">
      {/* Left section: Search */}
      <div className="flex-1 max-w-md">
        {showSearch ? (
          <div className="flex items-center gap-2 w-full md:max-w-xs">
            <Input
              placeholder="Search..."
              className="h-9 border-2 border-border focus:border-primary"
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
            <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)} className="border border-border">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground border border-border hover:border-primary"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Search...</span>
          </Button>
        )}
      </div>

      {/* Right section: Theme toggle, notifications and account */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative border border-border hover:border-primary">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 enhanced-dropdown">
            <div className="px-4 py-3 font-medium border-b border-border">Notifications</div>
            <DropdownMenuSeparator />
            {[...Array(3)].map((_, i) => (
              <DropdownMenuItem key={i} className="p-3 cursor-pointer border-b border-border/50 last:border-b-0">
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 border border-blue-600" />
                  <div>
                    <p className="font-medium text-sm">New student registered</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-3 flex justify-center text-sm text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 border border-border hover:border-primary">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium border-2 border-border">
                AD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="enhanced-dropdown">
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/admin-profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;

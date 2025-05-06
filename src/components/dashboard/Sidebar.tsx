import React, { useState } from "react";
import {
  BarChart,
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  Library,
  PieChart,
  Settings,
  HelpCircle,
  Menu,
  X,
  UserCircle,
  StepForwardIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "@/stores/useUserStore";

type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  to?: string;
  onClick?: () => void;
};

const SidebarItem = ({
  icon: Icon,
  label,
  active,
  to,
  onClick,
}: SidebarItemProps) => {
  const Content = () => (
    <>
      <Icon size={20} />
      <span>{label}</span>``
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={cn(
          "sidebar-item w-full text-left",
          active && "sidebar-item-active"
        )}
      >
        <Content />
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "sidebar-item w-full text-left",
        active && "sidebar-item-active"
      )}
    >
      <Content />
    </button>
  );
};

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { currentUser } = useUserStore();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-sidebar-primary text-white rounded-md"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      <aside
        className={cn(
          "bg-sidebar h-screen flex flex-col border-r border-sidebar-border transition-all duration-300",
          isMobile
            ? isOpen
              ? "fixed inset-y-0 left-0 w-64 z-40"
              : "fixed -left-64 w-64 z-40"
            : "w-64"
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground uppercase flex items-center">
            <GraduationCap className="mr-2  " size={24} /> Attendify
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <SidebarItem
            icon={BarChart}
            label="Overview"
            active={location.pathname === "/"}
            to="/"
          />
          <SidebarItem
            icon={Users}
            label="Lecturer"
            active={location.pathname === "/lecturers"}
            to="/lecturers"
          />
          <SidebarItem
            icon={GraduationCap}
            label="Student"
            active={location.pathname === "/students"}
            to="/students"
          />
          <SidebarItem
            icon={Calendar}
            label="Attendance"
            active={location.pathname === "/attendance"}
            to="/attendance"
          />
          <SidebarItem
            icon={BookOpen}
            label="Course"
            active={location.pathname === "/courses"}
            to="/courses"
          />
          <SidebarItem
            icon={Library}
            label="Academic Session"
            active={location.pathname === "/academic-sessions"}
            to="/academic-sessions"
          />
          <SidebarItem
            icon={Calendar}
            label="Activities"
            active={location.pathname === "/activities"}
            to="/activities"
          />
          <SidebarItem
            icon={PieChart}
            label="Performance"
            active={location.pathname === "/performance"}
            to="/performance"
          />
           <SidebarItem
            icon={StepForwardIcon}
            label="Quick Guide"
            active={location.pathname === "/quick-guide"}
            to="/quick-guide"
          />
        </nav>

        <div className="p-3 border-t border-sidebar-border space-y-1">
          <SidebarItem
            icon={UserCircle}
            label="My Profile"
            active={location.pathname === "/profile"}
            to="/profile"
          />
          <SidebarItem icon={Settings} label="Settings" /> 
          {/* <SidebarItem icon={HelpCircle} label="Help Center" /> */}
        </div>
      </aside>
    </>
  );
}

import { useState } from "react";
import { SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { BarChart3, LayoutDashboard, Lightbulb, Music } from "lucide-react";

export const SidebarNavigation = () => {
    const [activeSection, setActiveSection] = useState("overview");
    const sidebar = useSidebar();
  
    // Enhanced function to scroll to section and close sidebar
    const scrollToSection = (id: string) => {
      setActiveSection(id);
  
      // Close mobile sidebar when clicked
      if (sidebar.isMobile) {
        sidebar.setOpenMobile(false);
      }
  
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };
  
    return (
      <SidebarContent >
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => scrollToSection("overview")}
                isActive={activeSection === "overview"}
                tooltip="Overview"
              >
                <LayoutDashboard className="mr-2" />
                <span>Overview</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
  
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => scrollToSection("music-player")}
                isActive={activeSection === "music-player"}
                tooltip="Music Player"
              >
                <Music className="mr-2" />
                <span>Music Player</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
  
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => scrollToSection("light-control")}
                isActive={activeSection === "light-control"}
                tooltip="Light Control"
              >
                <Lightbulb className="mr-2" />
                <span>Light Control</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
  
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => scrollToSection("analytics")}
                isActive={activeSection === "analytics"}
                tooltip="Analytics"
              >
                <BarChart3 className="mr-2" />
                <span>Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    );
  };
  
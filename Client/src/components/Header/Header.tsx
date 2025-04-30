import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Header: React.FC = () => {
  return (
    <header className="h-20 py-2 px-4 bg-primary text-white w-full flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Kebab Menu Trigger for Sidebar */}
        <div className="md:hidden flex flex-col  text-white">
          <SidebarTrigger />
        </div>
        <h1 className="text-md md:text-4xl  font-bold">Iot Dashboard</h1>
      </div>

      <div id="header-end" className="flex gap-4 items-center">
        <div
          id="device-status-indecator"
          className="flex items-center rounded-full px-3 py-2 bg-gray-700 gap-3"
        >
          <div className="PulseIndicator relative h-4 w-4">
            <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 bg-green-500 rounded-full opacity-75 animate-ping"></div>
            <div className="absolute inset-0 bg-green-500 rounded-full opacity-50 animate-ping delay-200"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

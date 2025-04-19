

import React from "react";

const Sidebar = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <aside className="w-full h-full bg-primary text-primary hidden lg:flex flex-col p-5">
      <h1 className="text-4xl font-bold">Desk Sarthi</h1>
      <nav className="text-secondary pl-3 mt-12">
        <ul className="flex flex-col gap-4 text-3xl">
          <li
            onClick={() => scrollToSection("overview")}
            className="cursor-pointer"
          >
            Overview
          </li>
          <li
            onClick={() => scrollToSection("music-player")}
            className="cursor-pointer"
          >
            Music Player
          </li>
          <li
            onClick={() => scrollToSection("light-control")}
            className="cursor-pointer"
          >
            Light Control
          </li>
          <li
            onClick={() => scrollToSection("analytics")}
            className="cursor-pointer"
          >
            Analytics
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

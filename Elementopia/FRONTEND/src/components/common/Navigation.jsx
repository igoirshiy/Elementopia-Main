import React, { useState } from "react";
import { Menu } from "lucide-react";
import '@/assets/styles/legacy/navigation.css';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="landingpage-container">
      <nav className="nav-bar">

        <a className="logo" href="/">
          ELEMENTOPIA
        </a>

        <div className="nav-links">
        </div>
      </nav>
    </div>
  );
}

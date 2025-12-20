"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/images/Dashboard/home.png",
        label: "Home",
        href: "/dashboard/school",
      },
      {
        icon: "/images/Dashboard/teacher.png",
        label: "Teachers",
        href: "/dashboard/list/teachers",
      },
      {
        icon: "/images/Dashboard/student.png",
        label: "Students",
        href: "/dashboard/list/students",
      },
      {
        icon: "/images/Dashboard/calendar.png",
        label: "Events",
        href: "/dashboard/list/events",
        hasSubmenu: true,
        submenu: [
          {
            label: "All Events",
            href: "/events",
          },
          {
            label: "Analytics",
            href: "/dashboard/list/analytics",
          },
        ],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/images/Dashboard/profile.png",
        label: "Profile",
        href: "/profile",
      },
    ],
  },
];

const Menu = () => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <div className="mt-4 text-lg">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-white/60 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            const isClickable =
              item.href === "/dashboard/list/students" ||
              item.href === "/dashboard/list/teachers" ||
              item.hasSubmenu;

            // If item has submenu (Events)
            if (item.hasSubmenu && item.submenu) {
              return (
                <div key={item.label}>
                  <div
                    onClick={() => toggleSubmenu(item.label)}
                    className="flex items-center justify-center lg:justify-start gap-4 text-white py-2 md:px-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <Image
                      src={item.icon}
                      alt=""
                      width={20}
                      height={20}
                      className="brightness-0 invert"
                    />
                    <span className="hidden lg:block flex-1">{item.label}</span>
                    <svg
                      className={`hidden lg:block w-4 h-4 text-white transition-transform ${
                        openSubmenu === item.label ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  
                  {/* Submenu */}
                  {openSubmenu === item.label && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className="flex items-center gap-2 text-white/80 py-2 px-2 rounded-md hover:bg-white/10 hover:text-white cursor-pointer transition-colors text-sm"
                        >
                          <span className="w-1.5 h-1.5 bg-white/60 rounded-full"></span>
                          <span className="hidden lg:block">{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Clickable items (Students, Teachers)
            if (isClickable) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-center lg:justify-start gap-4 text-white py-2 md:px-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                >
                  <Image
                    src={item.icon}
                    alt=""
                    width={20}
                    height={20}
                    className="brightness-0 invert"
                  />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }

            // Non-clickable items
            return (
              <div
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-4 text-white py-2 md:px-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="brightness-0 invert"
                />
                <span className="hidden lg:block">{item.label}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
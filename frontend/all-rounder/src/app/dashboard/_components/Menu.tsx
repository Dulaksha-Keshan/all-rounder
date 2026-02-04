"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface MenuProps {
  schoolId?: string;
  orgId?: string;
  type?: "School" | "Organization";
}

const Menu = ({ schoolId, orgId, type }: MenuProps) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Determine the base path based on what's provided
  const getBasePath = () => {
    if (schoolId) return `/dashboard/schools/${schoolId}`;
    if (orgId) return `/dashboard/orgs/${orgId}`;
    return "/dashboard";
  };

  const basePath = getBasePath();

  // Different menu items based on type
  const getMenuItems = () => {
    if (type === "Organization") {
      // Organization menu - no students/teachers
      return [
        {
          title: "MENU",
          items: [
            {
              icon: "/images/Dashboard/home.png",
              label: "Home",
              href: basePath,
            },
            {
              icon: "/images/Dashboard/calendar.png",
              label: "Events",
              href: `${basePath}/events`,
              hasSubmenu: true,
              submenu: [
                {
                  label: "All Events",
                  href: "/events",
                },
                {
                  label: "Analytics",
                  href: `${basePath}/analytics`,
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
    }

    // School menu - includes students/teachers
    return [
      {
        title: "MENU",
        items: [
          {
            icon: "/images/Dashboard/home.png",
            label: "Home",
            href: basePath,
          },
          {
            icon: "/images/Dashboard/teacher.png",
            label: "Teachers",
            href: `${basePath}/teachers`,
          },
          {
            icon: "/images/Dashboard/student.png",
            label: "Students",
            href: `${basePath}/students`,
          },
          {
            icon: "/images/Dashboard/calendar.png",
            label: "Events",
            href: `${basePath}/events`,
            hasSubmenu: true,
            submenu: [
              {
                label: "All Events",
                href: "/events",
              },
              {
                label: "Analytics",
                href: `${basePath}/analytics`,
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
  };

  const menuItems = getMenuItems();

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="mt-4 text-lg">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-white/60 font-bold text-xs tracking-wider my-4 uppercase px-2">
            {i.title}
          </span>
          {i.items.map((item) => {
            // If item has submenu (Events)
            if (item.hasSubmenu && item.submenu) {
              return (
                <div key={item.label}>
                  <div
                    onClick={() => toggleSubmenu(item.label)}
                    className={`flex items-center justify-center lg:justify-start gap-4 text-white py-3 md:px-3 rounded-lg hover:bg-white/10 cursor-pointer transition-all ${isActive(item.href) ? "bg-white/20 shadow-inner" : ""
                      }`}
                  >
                    <Image
                      src={item.icon}
                      alt=""
                      width={20}
                      height={20}
                      className="brightness-0 invert opacity-90"
                    />
                    <span className="hidden lg:block flex-1 font-bold tracking-wide text-[15px]">{item.label}</span>
                    <svg
                      className={`hidden lg:block w-4 h-4 text-white/80 transition-transform duration-300 ${openSubmenu === item.label ? "rotate-180" : ""
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
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
                          className={`flex items-center gap-2 text-white/80 py-2.5 px-3 rounded-md hover:bg-white/10 hover:text-white cursor-pointer transition-all text-sm font-medium ${isActive(subItem.href) ? "bg-white/20 text-white shadow-sm" : ""
                            }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isActive(subItem.href) ? "bg-white" : "bg-white/40"}`}></span>
                          <span className="hidden lg:block">{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // All other menu items are clickable
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-center lg:justify-start gap-4 text-white py-3 md:px-3 rounded-lg hover:bg-white/10 cursor-pointer transition-all ${isActive(item.href) ? "bg-white/20 shadow-inner" : ""
                  }`}
              >
                <Image
                  src={item.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="brightness-0 invert opacity-90"
                />
                <span className="hidden lg:block font-bold tracking-wide text-[15px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
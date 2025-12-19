// // import Image from "next/image";
// // // import Link from "next/link";

// // const menuItems = [
// //   {
// //     title: "MENU",
// //     items: [
// //       {
// //         icon: "/images/Dashboard/home.png",
// //         label: "Home",
// //         href: "/",
// //       },
// //       {
// //         icon: "/images/Dashboard/teacher.png",
// //         label: "Teachers",
// //         href: "/list/teachers",
// //       },
// //       {
// //         icon: "/images/Dashboard/student.png",
// //         label: "Students",
// //         href: "/list/student",
// //       },
// //       {
// //         icon: "/images/Dashboard/calendar.png",
// //         label: "Events",
// //         href: "/list/events",
// //       },
// //     ],
// //   },
// //   {
// //     title: "OTHER",
// //     items: [
// //       {
// //         icon: "/images/Dashboard/profile.png",
// //         label: "Profile",
// //         href: "/profile",
// //       },
// //     ],
// //   },
// // ];

// // const Menu = () => {
// //   return (
// //     <div className="mt-4 text-lg">
// //       {menuItems.map((i) => (
// //         <div className="flex flex-col gap-2" key={i.title}>
// //           <span className="hidden lg:block text-white/60 font-light my-4">
// //             {i.title}
// //           </span>
// //           {i.items.map((item) => (
// //             <div
// //               key={item.label}
// //               className="flex items-center justify-center lg:justify-start gap-4 text-white py-2 md:px-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
// //             >
// //               <Image src={item.icon} alt="" width={20} height={20} className="brightness-0 invert" />
// //               <span className="hidden lg:block">{item.label}</span>
// //             </div>
// //           ))}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default Menu;



// import Image from "next/image";
// import Link from "next/link";

// const menuItems = [
//   {
//     title: "MENU",
//     items: [
//       {
//         icon: "/images/Dashboard/home.png",
//         label: "Home",
//         href: "/dashboard/school",  // Update this too if needed
//       },
//       {
//         icon: "/images/Dashboard/teacher.png",
//         label: "Teachers",
//         href: "/dashboard/list/teachers",
//       },
//       {
//         icon: "/images/Dashboard/student.png",
//         label: "Students",
//         href: "/dashboard/list/students",  // Changed to /dashboard/list/students
//       },
//       {
//         icon: "/images/Dashboard/calendar.png",
//         label: "Events",
//         href: "/dashboard/list/events",
//       },
//     ],
//   },
//   {
//     title: "OTHER",
//     items: [
//       {
//         icon: "/images/Dashboard/profile.png",
//         label: "Profile",
//         href: "/profile",
//       },
//     ],
//   },
// ];

// const Menu = () => {
//   return (
//     <div className="mt-4 text-lg">
//       {menuItems.map((i) => (
//         <div className="flex flex-col gap-2" key={i.title}>
//           <span className="hidden lg:block text-white/60 font-light my-4">
//             {i.title}
//           </span>
//           {i.items.map((item) => {
//             // Only Students link is clickable
//             if (item.href === "/dashboard/list/students") {
//               return (
//                 <Link
//                   key={item.label}
//                   href={item.href}
//                   className="flex items-center justify-center lg:justify-start gap-4 text-white py-2 md:px-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
//                 >
//                   <Image src={item.icon} alt="" width={20} height={20} className="brightness-0 invert" />
//                   <span className="hidden lg:block">{item.label}</span>
//                 </Link>
//               );
//             }
            
//             // Other items remain as divs
//             return (
//               <div
//                 key={item.label}
//                 className="flex items-center justify-center lg:justify-start gap-4 text-white py-2 md:px-2 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
//               >
//                 <Image src={item.icon} alt="" width={20} height={20} className="brightness-0 invert" />
//                 <span className="hidden lg:block">{item.label}</span>
//               </div>
//             );
//           })}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Menu;

import Image from "next/image";
import Link from "next/link";

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
  return (
    <div className="mt-4 text-lg">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-white/60 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            // Make Students and Teachers links clickable
            if (
              item.href === "/dashboard/list/students" ||
              item.href === "/dashboard/list/teachers"
            ) {
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

            // Other items remain as divs
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

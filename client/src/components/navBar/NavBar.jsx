import React, { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";
import { HttpStatusCode } from "axios";
import { axiosInstance } from "../../utils/axiosInstance";
import { apiPath } from "../../utils/apiPath";

const Navbar = ({ setWayPoints }) => {
  const [categories, setCategories] = useState([
    { id: 1, title: "category 1", parentId: null },
    { id: 2, title: "category 2", parentId: null },
    { id: 3, title: "category 3", parentId: 1 },
    { id: 4, title: "category 4", parentId: 2 },
    { id: 5, title: "category 5", parentId: 1 },
    { id: 6, title: "category 6", parentId: null },
  ]);

  const routes = [
    { title: "Direct Flights", href: "/direct" },
    { title: "Connecting Flights", href: "/connecting" },
    { title: "Multi-City", href: "/multi-city" },
  ];

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(apiPath.category.baseUrl);
      if (res.status !== HttpStatusCode.Ok) throw new Error();

      setCategories(res.data);
    } catch (err) {}
  };

  // useEffect(() => {
  //   fetchCategories();
  // }, []);

  const handleSetWaypoints = async (categoryId) => {
    try {
      const res = await axiosInstance.get(
        apiPath.category.getDestinations(categoryId)
      );
      if (res.status !== HttpStatusCode.Ok) throw new Error();

      setWayPoints(res.data);
    } catch (err) {}
  };

  return (
    <nav className="border-b bg-white relative z-50">
      <div className="max-w-7xl mx-auto px-1 sm:px-2 lg:px-3">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Plane className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold">TravelApp</span>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex justify-center">
            <NavigationMenu className="relative z-50">
              <NavigationMenuList>
                {categories
                  .filter((c) => c.parentId === null)
                  .map((c) => (
                    <NavigationMenuItem key={c.id}>
                      <NavigationMenuTrigger>{c.title}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                          <li className="row-span-3">
                            <NavigationMenuLink asChild>
                              <a
                                className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                href="/"
                              >
                                {/* <Icons.logo className="h-6 w-6" /> */}
                                <div className="mb-2 mt-4 text-lg font-medium">
                                  shadcn/ui
                                </div>
                                <p className="text-sm leading-tight text-muted-foreground">
                                  Beautifully designed components built with
                                  Radix UI and Tailwind CSS.
                                </p>
                              </a>
                            </NavigationMenuLink>
                          </li>
                          {categories
                          .filter((e) => e.parentId === c.id)
                          .map((e) => (
                            <li key={e.id} className="row-span-3">
                              {e.title}
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Routes</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-48 gap-2 p-4">
                      {routes.map((route) => (
                        <li key={route.href}>
                          <NavigationMenuLink asChild>
                            <a
                              href={route.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100"
                            >
                              {route.title}
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Login</Button>
            <Button>Sign up</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

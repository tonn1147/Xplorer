import React from "react";
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

const Navbar = () => {
  const destinations = [
    { title: "Europe", href: "/europe" },
    { title: "Asia", href: "/asia" },
    { title: "Americas", href: "/americas" },
    { title: "Africa", href: "/africa" },
  ];

  const routes = [
    { title: "Direct Flights", href: "/direct" },
    { title: "Connecting Flights", href: "/connecting" },
    { title: "Multi-City", href: "/multi-city" },
  ];

  return (
    <nav className="border-b bg-white relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Destinations</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-48 gap-2 p-4">
                      {destinations.map((destination) => (
                        <li key={destination.href}>
                          <NavigationMenuLink asChild>
                            <a
                              href={destination.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100"
                            >
                              {destination.title}
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
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

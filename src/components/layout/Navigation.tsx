"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  Home,
  Save,
  Box,
} from "lucide-react";

interface NavigationProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export function Navigation({
  onMenuToggle,
  showMenuButton = false,
}: NavigationProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/editor", label: "New Design", icon: Home },
  ];

  const isFullWidthPage = pathname === "/editor";

  return (
    <header className="h-16 border-b bg-white/80 backdrop-blur-xl border-gray-200/50 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className={`flex items-center justify-between gap-4 w-full ${!isFullWidthPage ? 'max-w-7xl mx-auto' : ''}`}>
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link
            href="/dashboard"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <Box className="h-7 w-7 text-orange-600" />
              <div className="absolute -inset-1 bg-orange-600/20 blur-lg -z-10"></div>
            </div>
            <span className="font-bold text-xl text-gray-900">
              FurnitureViz
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 ml-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-orange-50"
                >
                  <Avatar className="h-10 w-10 border-2 border-orange-200">
                    <AvatarFallback className="bg-orange-100 text-orange-700 font-semibold">
                      {getInitials(session.user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-gray-500">
                      {session.user.email}
                    </p>
                    <p className="text-xs leading-none text-orange-600 mt-1 capitalize font-medium">
                      {session.user.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/saved-designs" className="cursor-pointer">
                    <Save className="mr-2 h-4 w-4" />
                    Saved Designs
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="hover:bg-gray-100">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-500/20">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

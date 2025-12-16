// src/components/layout/Header.tsx
"use client";

import { Bell, Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/lib/store/uiStore";

interface HeaderProps {
    title?: string;
}

export default function Header({ title }: HeaderProps) {
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 md:px-6">
            {/* Mobile menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
            >
                <Menu size={20} />
            </Button>

            {/* Page title - hidden on very small screens */}
            {title && (
                <h1 className="text-lg md:text-xl font-semibold text-gray-900 hidden sm:block">
                    {title}
                </h1>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center border-2 border-white"
                    style={{ backgroundColor: "#EF4444" }}
                >
                    3
                </Badge>
            </Button>

            {/* User menu - Hidden on mobile, logout moved to sidebar */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden md:flex items-center gap-2">
                        <div
                            className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-semibold"
                            style={{ backgroundColor: "#C49A6C" }}
                        >
                            {user?.name?.charAt(0) || "A"}
                        </div>
                        <span className="hidden lg:inline-block text-sm font-medium">
                            {user?.name || "Admin"}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
                            <p className="text-xs text-gray-500">{user?.email || "admin@woodenhouses.co.ke"}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                        <User size={16} className="mr-2" />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        <Bell size={16} className="mr-2" />
                        Notifications
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                        <LogOut size={16} className="mr-2" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
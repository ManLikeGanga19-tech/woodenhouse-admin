// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "@/lib/store/authStore";

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const success = await login(email, password);

            if (success) {
                router.push("/dashboard");
            } else {
                setError("Invalid password. Please try again.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
            <Card className="w-full max-w-md shadow-xl border-2">
                <CardHeader className="space-y-4 text-center pb-8">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div
                            className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg overflow-hidden"
                        >
                            <Image
                                src="/woodenhouse-logo.jpg"
                                alt="WoodenHouses Logo"
                                width={56}
                                height={56}
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <CardTitle className="text-2xl font-bold" style={{ color: "#8B5E3C" }}>
                            WoodenHouses Admin
                        </CardTitle>
                        <CardDescription className="text-base mt-2">
                            Sign in to access the admin dashboard
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@woodenhouses.co.ke"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="pl-10 border-2 focus:border-[#8B5E3C] h-11"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">
                                Password
                            </Label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="pl-10 border-2 focus:border-[#8B5E3C] h-11"
                                />
                            </div>
                        </div>

                        {/* Info Text */}
                        <div className="text-xs text-gray-500 bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <p className="font-medium text-blue-900 mb-1">Demo Credentials:</p>
                            <p>Password: <code className="bg-blue-100 px-1 py-0.5 rounded">admin123</code></p>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all"
                            style={{ backgroundColor: "#8B5E3C" }}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-xs text-gray-500">
                        <p>Wooden Houses Kenya Admin Portal</p>
                        <p className="mt-1">© 2024 All rights reserved</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
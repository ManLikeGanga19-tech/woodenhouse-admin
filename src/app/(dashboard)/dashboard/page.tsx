// src/app/(dashboard)/dashboard/page.tsx
"use client";

import { Users, Mail, FileText, TrendingUp } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentActivity from "@/components/dashboard/RecentActivity";
import QuickActions from "@/components/dashboard/QuickActions";
import { mockContacts, mockNewsletter, mockQuotes, mockActivity } from "@/lib/utils/mockData";

export default function DashboardPage() {
    // Calculate stats from mock data
    const totalContacts = mockContacts.length;
    const pendingContacts = mockContacts.filter(c => c.status === 'new').length;
    const activeSubscribers = mockNewsletter.filter(s => s.status === 'active').length;
    const totalQuotes = mockQuotes.length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: "#8B5E3C" }}>
                        Dashboard
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Welcome back! Here's what's happening with your business.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Contacts"
                    value={totalContacts}
                    icon={Users}
                    iconColor="#3B82F6"
                    iconBgColor="#EFF6FF"
                    trend={{ value: 12, isPositive: true }}
                    description="All customer inquiries"
                />

                <StatsCard
                    title="Pending Contacts"
                    value={pendingContacts}
                    icon={Users}
                    iconColor="#F59E0B"
                    iconBgColor="#FEF3C7"
                    description="Needs immediate attention"
                />

                <StatsCard
                    title="Newsletter Subscribers"
                    value={activeSubscribers}
                    icon={Mail}
                    iconColor="#10B981"
                    iconBgColor="#F0FDF4"
                    trend={{ value: 8, isPositive: true }}
                    description="Active subscribers"
                />

                <StatsCard
                    title="Quotes This Month"
                    value={totalQuotes}
                    icon={FileText}
                    iconColor="#8B5CF6"
                    iconBgColor="#F5F3FF"
                    trend={{ value: 5, isPositive: false }}
                    description="Sent and pending"
                />
            </div>

            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <RecentActivity activities={mockActivity.slice(0, 8)} />
                </div>

                {/* Summary Card */}
                <div className="space-y-6">
                    <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp size={20} style={{ color: "#8B5E3C" }} />
                            <h3 className="font-semibold" style={{ color: "#8B5E3C" }}>
                                This Month
                            </h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">New Contacts</span>
                                <span className="font-semibold text-gray-900">
                                    {mockContacts.filter(c => {
                                        const date = new Date(c.createdAt);
                                        const now = new Date();
                                        return date.getMonth() === now.getMonth();
                                    }).length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Quotes Sent</span>
                                <span className="font-semibold text-gray-900">
                                    {mockQuotes.filter(q => q.status === 'sent').length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Conversions</span>
                                <span className="font-semibold text-gray-900">
                                    {mockContacts.filter(c => c.status === 'converted').length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                                <span className="text-sm font-medium text-gray-900">Conversion Rate</span>
                                <span className="font-bold" style={{ color: "#10B981" }}>
                                    {totalContacts > 0
                                        ? ((mockContacts.filter(c => c.status === 'converted').length / totalContacts) * 100).toFixed(1)
                                        : 0}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Status Overview */}
                    <div className="rounded-lg border-2 border-gray-200 bg-white p-6">
                        <h3 className="font-semibold mb-4" style={{ color: "#8B5E3C" }}>
                            Contact Status
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: 'New', count: mockContacts.filter(c => c.status === 'new').length, color: '#3B82F6' },
                                { label: 'Contacted', count: mockContacts.filter(c => c.status === 'contacted').length, color: '#F59E0B' },
                                { label: 'Quoted', count: mockContacts.filter(c => c.status === 'quoted').length, color: '#8B5CF6' },
                                { label: 'Converted', count: mockContacts.filter(c => c.status === 'converted').length, color: '#10B981' },
                            ].map(status => (
                                <div key={status.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: status.color }}
                                        />
                                        <span className="text-sm text-gray-600">{status.label}</span>
                                    </div>
                                    <span className="font-semibold text-gray-900">{status.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
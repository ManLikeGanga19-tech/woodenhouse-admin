// src/app/(dashboard)/newsletter/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Mail, Users, UserCheck, UserX } from "lucide-react";
import SearchBar from "@/components/common/SearchBar";
import ExportMenu from "@/components/common/ExportMenu";
import SubscribersTable from "@/components/newsletter/SubscribersTable";
import { mockNewsletter } from "@/lib/utils/mockData";
import { exportNewsletterToCSV } from "@/lib/utils/exporters";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function NewsletterPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sourceFilter, setSourceFilter] = useState("all");

    // Filter subscribers based on search and filters
    const filteredSubscribers = useMemo(() => {
        return mockNewsletter.filter((subscriber) => {
            // Search filter
            const matchesSearch =
                searchQuery === "" ||
                subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (subscriber.name && subscriber.name.toLowerCase().includes(searchQuery.toLowerCase()));

            // Status filter
            const matchesStatus =
                statusFilter === "all" || subscriber.status === statusFilter;

            // Source filter
            const matchesSource =
                sourceFilter === "all" || subscriber.source === sourceFilter;

            return matchesSearch && matchesStatus && matchesSource;
        });
    }, [searchQuery, statusFilter, sourceFilter]);

    const hasActiveFilters = statusFilter !== "all" || sourceFilter !== "all";

    const handleClearFilters = () => {
        setStatusFilter("all");
        setSourceFilter("all");
    };

    const handleExportCSV = () => {
        exportNewsletterToCSV(filteredSubscribers);
    };

    // Calculate stats
    const totalSubscribers = filteredSubscribers.length;
    const activeSubscribers = filteredSubscribers.filter((s) => s.status === "active").length;
    const unsubscribed = filteredSubscribers.filter((s) => s.status === "unsubscribed").length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: "#8B5E3C" }}>
                        Newsletter Subscribers
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage newsletter subscribers and mailing list
                    </p>
                </div>
                <ExportMenu
                    onExportCSV={handleExportCSV}
                    disabled={filteredSubscribers.length === 0}
                />
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <Users size={18} style={{ color: "#8B5E3C" }} />
                        <span className="text-sm font-medium text-gray-600">Total Subscribers</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{totalSubscribers}</p>
                </div>

                <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <UserCheck size={18} style={{ color: "#10B981" }} />
                        <span className="text-sm font-medium text-gray-600">Active</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold" style={{ color: "#10B981" }}>
                        {activeSubscribers}
                    </p>
                </div>

                <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <UserX size={18} style={{ color: "#EF4444" }} />
                        <span className="text-sm font-medium text-gray-600">Unsubscribed</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold" style={{ color: "#EF4444" }}>
                        {unsubscribed}
                    </p>
                </div>

                <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <Mail size={18} style={{ color: "#3B82F6" }} />
                        <span className="text-sm font-medium text-gray-600">Growth Rate</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold" style={{ color: "#3B82F6" }}>
                        +12%
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by email or name..."
                    className="sm:w-80"
                />

                <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40 border-2">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="unsubscribed">Unsubscribed</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Source Filter */}
                    <Select value={sourceFilter} onValueChange={setSourceFilter}>
                        <SelectTrigger className="w-[180px] border-2">
                            <SelectValue placeholder="Filter by source" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="contact-form">Contact Form</SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleClearFilters}
                            className="border-2"
                        >
                            <X size={14} className="mr-1" />
                            Clear Filters
                        </Button>
                    )}
                </div>
            </div>

            {/* Subscribers Table */}
            <SubscribersTable subscribers={filteredSubscribers} />

            {/* Results count */}
            {filteredSubscribers.length > 0 && (
                <p className="text-sm text-gray-500 text-center">
                    Showing {filteredSubscribers.length} of {mockNewsletter.length} subscribers
                </p>
            )}
        </div>
    );
}
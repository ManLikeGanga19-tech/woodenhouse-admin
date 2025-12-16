// src/app/(dashboard)/quotes/page.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FileText, DollarSign, CheckCircle, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/common/SearchBar";
import ExportMenu from "@/components/common/ExportMenu";
import QuotesTable from "@/components/quotes/QuotesTable";
import { mockQuotes } from "@/lib/utils/mockData";
import { exportQuotesToCSV } from "@/lib/utils/exporters";
import { formatCurrency } from "@/lib/utils/formatters";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

export default function QuotesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // Filter quotes based on search and filters
    const filteredQuotes = useMemo(() => {
        return mockQuotes.filter((quote) => {
            // Search filter
            const matchesSearch =
                searchQuery === "" ||
                quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                quote.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                quote.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            const matchesStatus =
                statusFilter === "all" || quote.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, statusFilter]);

    const hasActiveFilters = statusFilter !== "all";

    const handleClearFilters = () => {
        setStatusFilter("all");
    };

    const handleExportCSV = () => {
        exportQuotesToCSV(filteredQuotes);
    };

    const handleCreateQuote = () => {
        router.push("/dashboard/quotes/new");
    };

    // Calculate stats
    const totalQuotes = filteredQuotes.length;
    const draftQuotes = filteredQuotes.filter((q) => q.status === "draft").length;
    const sentQuotes = filteredQuotes.filter((q) => q.status === "sent").length;
    const acceptedQuotes = filteredQuotes.filter((q) => q.status === "accepted").length;
    const totalValue = filteredQuotes
        .filter((q) => q.status === "accepted")
        .reduce((sum, q) => sum + q.finalPrice, 0);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: "#8B5E3C" }}>
                        Quotes
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Create and manage customer quotes
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportMenu
                        onExportCSV={handleExportCSV}
                        disabled={filteredQuotes.length === 0}
                    />
                    <Button
                        onClick={handleCreateQuote}
                        className="text-white font-semibold"
                        style={{ backgroundColor: "#8B5E3C" }}
                    >
                        <Plus size={16} className="mr-2" />
                        New Quote
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <FileText size={18} style={{ color: "#8B5E3C" }} />
                        <span className="text-sm font-medium text-gray-600">Total Quotes</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{totalQuotes}</p>
                </div>

                <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <Clock size={18} style={{ color: "#6B7280" }} />
                        <span className="text-sm font-medium text-gray-600">Draft</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold" style={{ color: "#6B7280" }}>
                        {draftQuotes}
                    </p>
                </div>

                <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <FileText size={18} style={{ color: "#3B82F6" }} />
                        <span className="text-sm font-medium text-gray-600">Sent</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold" style={{ color: "#3B82F6" }}>
                        {sentQuotes}
                    </p>
                </div>

                <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={18} style={{ color: "#10B981" }} />
                        <span className="text-sm font-medium text-gray-600">Accepted</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold" style={{ color: "#10B981" }}>
                        {acceptedQuotes}
                    </p>
                </div>
            </div>

            {/* Total Value Card */}
            <div className="rounded-lg border-2 border-[#8B5E3C] bg-linear-to-br from-[#8B5E3C] to-[#5D3A1A] p-6 text-white">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-white/80">Total Accepted Value</p>
                        <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by quote #, customer name, or email..."
                    className="sm:w-96"
                />

                <div className="flex flex-wrap items-center gap-3">
                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px] border-2">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="viewed">Viewed</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
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

            {/* Quotes Table */}
            <QuotesTable quotes={filteredQuotes} />

            {/* Results count */}
            {filteredQuotes.length > 0 && (
                <p className="text-sm text-gray-500 text-center">
                    Showing {filteredQuotes.length} of {mockQuotes.length} quotes
                </p>
            )}
        </div>
    );
}
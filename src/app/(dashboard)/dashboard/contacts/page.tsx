// src/app/(dashboard)/contacts/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Users } from "lucide-react";
import SearchBar from "@/components/common/SearchBar";
import ExportMenu from "@/components/common/ExportMenu";
import ContactsTable from "@/components/contacts/ContactsTable";
import ContactFilters from "@/components/contacts/ContactFilters";
import { mockContacts } from "@/lib/utils/mockData";
import { exportContactsToCSV } from "@/lib/utils/exporters";
import { Contact } from "@/types";

export default function ContactsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [serviceFilter, setServiceFilter] = useState("all");

    // Filter contacts based on search and filters
    const filteredContacts = useMemo(() => {
        return mockContacts.filter((contact) => {
            // Search filter
            const matchesSearch =
                searchQuery === "" ||
                contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                contact.phone.includes(searchQuery);

            // Status filter
            const matchesStatus =
                statusFilter === "all" || contact.status === statusFilter;

            // Service filter
            const matchesService =
                serviceFilter === "all" || contact.serviceType === serviceFilter;

            return matchesSearch && matchesStatus && matchesService;
        });
    }, [searchQuery, statusFilter, serviceFilter]);

    const hasActiveFilters = statusFilter !== "all" || serviceFilter !== "all";

    const handleClearFilters = () => {
        setStatusFilter("all");
        setServiceFilter("all");
    };

    const handleExportCSV = () => {
        exportContactsToCSV(filteredContacts);
    };

    // Calculate stats
    const totalContacts = filteredContacts.length;
    const newContacts = filteredContacts.filter((c) => c.status === "new").length;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold" style={{ color: "#8B5E3C" }}>
                        Contacts
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage customer inquiries and contact submissions
                    </p>
                </div>
                <ExportMenu
                    onExportCSV={handleExportCSV}
                    disabled={filteredContacts.length === 0}
                />
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <Users size={18} style={{ color: "#8B5E3C" }} />
                        <span className="text-sm font-medium text-gray-600">Total Contacts</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{totalContacts}</p>
                </div>

                <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <Users size={18} style={{ color: "#3B82F6" }} />
                        <span className="text-sm font-medium text-gray-600">New</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold" style={{ color: "#3B82F6" }}>
                        {newContacts}
                    </p>
                </div>

                <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <Users size={18} style={{ color: "#F59E0B" }} />
                        <span className="text-sm font-medium text-gray-600">Contacted</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold" style={{ color: "#F59E0B" }}>
                        {filteredContacts.filter((c) => c.status === "contacted").length}
                    </p>
                </div>

                <div className="rounded-lg border-2 border-gray-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <Users size={18} style={{ color: "#10B981" }} />
                        <span className="text-sm font-medium text-gray-600">Converted</span>
                    </div>
                    <p className="mt-2 text-2xl font-bold" style={{ color: "#10B981" }}>
                        {filteredContacts.filter((c) => c.status === "converted").length}
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by name, email, or phone..."
                    className="sm:w-80"
                />
                <ContactFilters
                    statusFilter={statusFilter}
                    serviceFilter={serviceFilter}
                    onStatusChange={setStatusFilter}
                    onServiceChange={setServiceFilter}
                    onClearFilters={handleClearFilters}
                    hasActiveFilters={hasActiveFilters}
                />
            </div>

            {/* Contacts Table */}
            <ContactsTable contacts={filteredContacts} />

            {/* Results count */}
            {filteredContacts.length > 0 && (
                <p className="text-sm text-gray-500 text-center">
                    Showing {filteredContacts.length} of {mockContacts.length} contacts
                </p>
            )}
        </div>
    );
}
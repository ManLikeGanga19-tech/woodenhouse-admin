// src/app/(dashboard)/contacts/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Phone, Mail, MapPin, Calendar, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import StatusBadge from "@/components/common/StatusBadge";
import { mockContacts } from "@/lib/utils/mockData";
import { formatDate, formatPhoneNumber } from "@/lib/utils/formatters";
import { SERVICE_TYPE_LABELS, BUDGET_LABELS, TIMELINE_LABELS, Contact } from "@/types";
import { useState } from "react";

export default function ContactDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const contactId = params.id as string;

    // Find contact from mock data
    const contact = mockContacts.find((c) => c.id === contactId);

    const [status, setStatus] = useState<Contact['status']>(contact?.status || "new");
    const [notes, setNotes] = useState(contact?.notes || "");

    if (!contact) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-xl font-semibold text-gray-900 mb-2">Contact not found</p>
                <p className="text-gray-600 mb-4">The contact you're looking for doesn't exist.</p>
                <Button onClick={() => router.push("/dashboard/contacts")}>
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Contacts
                </Button>
            </div>
        );
    }

    const handleSaveNotes = () => {
        // In real app, this would save to backend
        console.log("Saving notes:", notes);
        alert("Notes saved! (This will save to backend when ready)");
    };

    const handleUpdateStatus = (newStatus: string) => {
        setStatus(newStatus as Contact['status']);
        console.log("Updating status to:", newStatus);
        alert(`Status updated to ${newStatus}! (This will save to backend when ready)`);
    };

    const handleCreateQuote = () => {
        router.push(`/dashboard/quotes/new?contactId=${contact.id}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push("/dashboard/contacts")}
                    className="border-2"
                >
                    <ArrowLeft size={20} />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold" style={{ color: "#8B5E3C" }}>
                        Contact Details
                    </h1>
                    <p className="text-gray-600 mt-1">View and manage contact information</p>
                </div>
                <Button
                    onClick={handleCreateQuote}
                    className="text-white font-semibold"
                    style={{ backgroundColor: "#8B5E3C" }}
                >
                    <FileText size={16} className="mr-2" />
                    Create Quote
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Info - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Information Card */}
                    <Card className="border-2 border-gray-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl" style={{ color: "#8B5E3C" }}>
                                    Contact Information
                                </CardTitle>
                                <StatusBadge status={status} type="contact" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Name */}
                            <div className="flex items-start gap-3">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
                                    style={{ backgroundColor: "#F5F0EB" }}
                                >
                                    <User size={20} style={{ color: "#8B5E3C" }} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Full Name</p>
                                    <p className="font-semibold text-gray-900 text-lg">{contact.name}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-3">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
                                    style={{ backgroundColor: "#EFF6FF" }}
                                >
                                    <Mail size={20} style={{ color: "#3B82F6" }} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Email Address</p>
                                    <a
                                        href={`mailto:${contact.email}`}
                                        className="font-semibold text-gray-900 hover:text-[#8B5E3C] transition-colors"
                                    >
                                        {contact.email}
                                    </a>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-3">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
                                    style={{ backgroundColor: "#F0FDF4" }}
                                >
                                    <Phone size={20} style={{ color: "#10B981" }} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Phone Number</p>
                                    <a
                                        href={`tel:${contact.phone}`}
                                        className="font-semibold text-gray-900 hover:text-[#8B5E3C] transition-colors"
                                    >
                                        {formatPhoneNumber(contact.phone)}
                                    </a>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-start gap-3">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
                                    style={{ backgroundColor: "#FEF3C7" }}
                                >
                                    <MapPin size={20} style={{ color: "#F59E0B" }} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Location</p>
                                    <p className="font-semibold text-gray-900">{contact.location}</p>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="flex items-start gap-3">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
                                    style={{ backgroundColor: "#F5F3FF" }}
                                >
                                    <Calendar size={20} style={{ color: "#8B5CF6" }} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Submitted On</p>
                                    <p className="font-semibold text-gray-900">{formatDate(contact.createdAt, 'MMMM dd, yyyy')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Project Details Card */}
                    <Card className="border-2 border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-xl" style={{ color: "#8B5E3C" }}>
                                Project Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Service Type</p>
                                    <Badge variant="outline" className="text-sm">
                                        {SERVICE_TYPE_LABELS[contact.serviceType]}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Budget Range</p>
                                    <Badge variant="outline" className="text-sm">
                                        KES {BUDGET_LABELS[contact.budget]}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Timeline</p>
                                    <Badge variant="outline" className="text-sm">
                                        {TIMELINE_LABELS[contact.timeline]}
                                    </Badge>
                                </div>
                                {contact.priority && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Priority</p>
                                        <StatusBadge status={contact.priority} type="priority" />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Message Card */}
                    <Card className="border-2 border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-xl" style={{ color: "#8B5E3C" }}>
                                Customer Message
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-100">
                                <p className="text-gray-900 whitespace-pre-wrap">{contact.message}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - 1 column */}
                <div className="space-y-6">
                    {/* Status Management */}
                    <Card className="border-2 border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-lg" style={{ color: "#8B5E3C" }}>
                                Status Management
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="status" className="text-sm font-medium mb-2 block">
                                    Update Status
                                </Label>
                                <Select value={status} onValueChange={handleUpdateStatus}>
                                    <SelectTrigger id="status" className="border-2">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">New</SelectItem>
                                        <SelectItem value="contacted">Contacted</SelectItem>
                                        <SelectItem value="quoted">Quoted</SelectItem>
                                        <SelectItem value="converted">Converted</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {contact.contactedAt && (
                                <div className="pt-3 border-t border-gray-200">
                                    <p className="text-xs text-gray-500">Last Contacted</p>
                                    <p className="text-sm font-medium text-gray-900 mt-1">
                                        {formatDate(contact.contactedAt, 'MMM dd, yyyy')}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Internal Notes */}
                    <Card className="border-2 border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-lg" style={{ color: "#8B5E3C" }}>
                                Internal Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add internal notes about this contact..."
                                rows={6}
                                className="border-2 focus:border-[#8B5E3C] resize-none"
                            />
                            <Button
                                onClick={handleSaveNotes}
                                className="w-full"
                                style={{ backgroundColor: "#8B5E3C" }}
                            >
                                Save Notes
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="border-2 border-gray-200">
                        <CardHeader>
                            <CardTitle className="text-lg" style={{ color: "#8B5E3C" }}>
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Button
                                variant="outline"
                                className="w-full justify-start border-2"
                                onClick={() => window.location.href = `mailto:${contact.email}`}
                            >
                                <Mail size={16} className="mr-2" />
                                Send Email
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start border-2"
                                onClick={() => window.location.href = `tel:${contact.phone}`}
                            >
                                <Phone size={16} className="mr-2" />
                                Call Customer
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start border-2"
                                onClick={handleCreateQuote}
                            >
                                <FileText size={16} className="mr-2" />
                                Create Quote
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
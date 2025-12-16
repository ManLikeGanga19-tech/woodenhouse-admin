"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockQuotes } from "@/lib/utils/mockData";
import { formatCurrency } from "@/lib/utils/formatters";
import { format } from "date-fns";

export default function ViewQuotePage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();

    const quote = mockQuotes.find((q) => q.id === id);

    if (!quote) {
        return (
            <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">Quote not found</p>
            </div>
        );
    }

    const statusStyles: Record<string, string> = {
        draft: "bg-gray-100 text-gray-700",
        sent: "bg-blue-100 text-blue-700",
        viewed: "bg-yellow-100 text-yellow-700",
        accepted: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-700",
        expired: "bg-gray-200 text-gray-700",
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6 print:space-y-4">
            {/* Header (hidden on print) */}
            <div className="flex items-center gap-4 print:hidden">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.back()}
                    className="border-2"
                >
                    <ArrowLeft size={18} />
                </Button>

                <div>
                    <h1 className="text-2xl font-bold" style={{ color: "#8B5E3C" }}>
                        Quote #{quote.quoteNumber}
                    </h1>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                        <Calendar size={14} />
                        {format(new Date(quote.createdAt), "PPP")}
                    </p>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <Badge className={`capitalize ${statusStyles[quote.status]}`}>
                        {quote.status}
                    </Badge>

                    <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="border-2"
                    >
                        <Printer size={16} className="mr-2" />
                        Print / PDF
                    </Button>
                </div>
            </div>

            <Separator className="print:hidden" />

            {/* Printable Content */}
            <div className="rounded-lg border-2 bg-white p-6 print:border-0 print:p-0">
                <div className="mb-6">
                    <h2 className="text-xl font-bold" style={{ color: "#8B5E3C" }}>
                        WoodenHouses — Quote
                    </h2>
                    <p className="text-sm text-gray-600">
                        Quote Number: <strong>{quote.quoteNumber}</strong>
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-sm mb-6">
                    <div>
                        <p className="font-semibold">Customer</p>
                        <p>{quote.customerName}</p>
                        <p>{quote.customerEmail}</p>
                        <p>{quote.customerPhone}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Project Details</p>
                        <p>House Type: {quote.houseType}</p>
                        <p>Location: {quote.location}</p>
                        {quote.houseSize && <p>Size: {quote.houseSize}</p>}
                    </div>
                </div>

                <Separator />

                <div className="mt-6 text-sm">
                    <div className="flex justify-between mb-2">
                        <span>Base Price</span>
                        <span>{formatCurrency(quote.basePrice)}</span>
                    </div>

                    {quote.additionalCosts.map((cost) => (
                        <div key={cost.id} className="flex justify-between text-gray-600">
                            <span>{cost.item}</span>
                            <span>{formatCurrency(cost.cost)}</span>
                        </div>
                    ))}

                    <Separator className="my-3" />

                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span style={{ color: "#8B5E3C" }}>
                            {formatCurrency(quote.finalPrice)}
                        </span>
                    </div>
                </div>

                {quote.notes && (
                    <div className="mt-6 text-sm">
                        <p className="font-semibold">Notes</p>
                        <p className="text-gray-600">{quote.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

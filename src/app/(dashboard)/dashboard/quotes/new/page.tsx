// src/app/(dashboard)/quotes/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Send, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuoteForm from "@/components/quotes/QuoteForm";
import PricingBreakdown from "@/components/quotes/PricingBreakdown";
import QuotePreview from "@/components/quotes/QuotePreview";
import { Quote, AdditionalCost } from "@/types";
import { mockContacts } from "@/lib/utils/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_QUOTE_VALUES, HOUSE_TYPE_PRICES } from "@/lib/utils/constants";

export default function CreateQuotePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const contactId = searchParams.get("contactId");

    // Initialize form data
    const [formData, setFormData] = useState<Partial<Quote>>({
        quoteNumber: `QT-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`,
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        houseType: undefined,
        houseSize: "",
        location: "",
        basePrice: 0,
        additionalCosts: [],
        discount: 0,
        totalPrice: 0,
        finalPrice: 0,
        paymentTerms: DEFAULT_QUOTE_VALUES.paymentTerms,
        deliveryTimeline: DEFAULT_QUOTE_VALUES.deliveryTimeline,
        validityPeriod: DEFAULT_QUOTE_VALUES.validityPeriod,
        notes: "",
        status: "draft",
        createdAt: new Date(),
    });

    const [showPreview, setShowPreview] = useState(false);

    // Pre-fill data if contactId is provided
    useEffect(() => {
        if (contactId) {
            const contact = mockContacts.find((c) => c.id === contactId);
            if (contact) {
                setFormData((prev) => ({
                    ...prev,
                    customerName: contact.name,
                    customerEmail: contact.email,
                    customerPhone: contact.phone,
                    location: contact.location,
                }));
            }
        }
    }, [contactId]);

    // Update base price when house type changes
    useEffect(() => {
        if (formData.houseType && formData.basePrice === 0) {
            const suggestedPrice = HOUSE_TYPE_PRICES[formData.houseType] || 0;
            setFormData((prev) => ({ ...prev, basePrice: suggestedPrice }));
        }
    }, [formData.houseType]);

    // Calculate totals whenever pricing changes
    useEffect(() => {
        const additionalTotal = formData.additionalCosts?.reduce((sum, cost) => sum + cost.cost, 0) || 0;
        const subtotal = (formData.basePrice || 0) + additionalTotal;
        const final = subtotal - (formData.discount || 0);

        setFormData((prev) => ({
            ...prev,
            totalPrice: subtotal,
            finalPrice: final,
        }));
    }, [formData.basePrice, formData.additionalCosts, formData.discount]);

    const handleFormChange = (field: keyof Quote, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveAsDraft = () => {
        console.log("Saving as draft:", formData);
        alert("Quote saved as draft! (Will save to backend when ready)");
        router.push("/dashboard/quotes");
    };

    const handleSendQuote = () => {
        if (!validateForm()) return;

        console.log("Sending quote:", formData);
        alert(`Quote sent to ${formData.customerEmail}! (Will send via email when backend is ready)`);
        router.push("/dashboard/quotes");
    };

    const validateForm = () => {
        if (!formData.customerName || !formData.customerEmail || !formData.location) {
            alert("Please fill in all required customer fields");
            return false;
        }
        if (!formData.houseType) {
            alert("Please select a house type");
            return false;
        }
        if (!formData.basePrice || formData.basePrice === 0) {
            alert("Please enter a base price");
            return false;
        }
        if (!formData.validityPeriod) {
            alert("Please enter quote validity period");
            return false;
        }
        return true;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => router.push("/dashboard/quotes")}
                    className="border-2"
                >
                    <ArrowLeft size={20} />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold" style={{ color: "#8B5E3C" }}>
                        Create New Quote
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Fill in the details to create a quote for your customer
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleSaveAsDraft}
                        className="border-2"
                    >
                        <Save size={16} className="mr-2" />
                        Save as Draft
                    </Button>
                    <Button
                        onClick={handleSendQuote}
                        className="text-white font-semibold"
                        style={{ backgroundColor: "#8B5E3C" }}
                    >
                        <Send size={16} className="mr-2" />
                        Send Quote
                    </Button>
                </div>
            </div>

            {/* Tabs for Form and Preview */}
            <Tabs value={showPreview ? "preview" : "form"} onValueChange={(v) => setShowPreview(v === "preview")}>
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="form">Form</TabsTrigger>
                    <TabsTrigger value="preview">
                        <Eye size={16} className="mr-2" />
                        Preview
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="form" className="mt-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Left side - Form (2 columns) */}
                        <div className="lg:col-span-2">
                            <QuoteForm formData={formData} onFormChange={handleFormChange} />
                        </div>

                        {/* Right side - Pricing (1 column) */}
                        <div>
                            <PricingBreakdown
                                basePrice={formData.basePrice || 0}
                                additionalCosts={formData.additionalCosts || []}
                                discount={formData.discount || 0}
                                onBasePriceChange={(value) => handleFormChange("basePrice", value)}
                                onAdditionalCostsChange={(costs: AdditionalCost[]) =>
                                    handleFormChange("additionalCosts", costs)
                                }
                                onDiscountChange={(value) => handleFormChange("discount", value)}
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-6">
                    <div className="max-w-3xl mx-auto">
                        <QuotePreview quote={formData} quoteNumber={formData.quoteNumber} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
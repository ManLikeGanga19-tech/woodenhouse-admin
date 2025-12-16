"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

import { mockQuotes } from "@/lib/utils/mockData";
import { Quote } from "@/types";

// ---------------------------------------------
// Schema (UI-only, backend-ready)
// ---------------------------------------------
const editQuoteSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),

  houseType: z.enum(["2-bedroom", "3-bedroom", "cabin", "custom"]),
  houseSize: z.string().optional(),
  location: z.string().min(1),

  basePrice: z.number().min(0),
  discount: z.number().min(0),

  paymentTerms: z.string().optional(),
  deliveryTimeline: z.string().optional(),
  validityPeriod: z.string(),

  notes: z.string().optional(),
});

type EditQuoteForm = z.infer<typeof editQuoteSchema>;

export default function EditQuotePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const quote = mockQuotes.find((q) => q.id === id);

  if (!quote) {
    return <p className="text-gray-500">Quote not found</p>;
  }

  const form = useForm<EditQuoteForm>({
    resolver: zodResolver(editQuoteSchema),
    defaultValues: {
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerPhone: quote.customerPhone,
      houseType: quote.houseType,
      houseSize: quote.houseSize,
      location: quote.location,
      basePrice: quote.basePrice,
      discount: quote.discount,
      paymentTerms: quote.paymentTerms,
      deliveryTimeline: quote.deliveryTimeline,
      validityPeriod: quote.validityPeriod,
      notes: quote.notes,
    },
  });

  const onSubmit = (data: EditQuoteForm) => {
    console.log("Updated Quote (UI only):", data);

    toast.success("Quote updated (UI only)", {
      description: "Backend integration will persist this later.",
    });

    router.push(`/dashboard/quotes/${quote.id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
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
            Edit Quote #{quote.quoteNumber}
          </h1>
          <p className="text-sm text-gray-500">
            Update quote details before sending
          </p>
        </div>
      </div>

      <Separator />

      {/* Form */}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-lg border-2"
      >
        {/* Customer Info */}
        <section className="space-y-4">
          <h2 className="font-semibold">Customer Information</h2>

          <Input {...form.register("customerName")} placeholder="Customer Name" />
          <Input {...form.register("customerEmail")} placeholder="Customer Email" />
          <Input {...form.register("customerPhone")} placeholder="Customer Phone" />
        </section>

        <Separator />

        {/* House Info */}
        <section className="space-y-4">
          <h2 className="font-semibold">House Details</h2>

          <Select
            value={form.watch("houseType")}
            onValueChange={(value) =>
              form.setValue("houseType", value as Quote["houseType"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select house type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2-bedroom">2 Bedroom</SelectItem>
              <SelectItem value="3-bedroom">3 Bedroom</SelectItem>
              <SelectItem value="cabin">Cabin</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          <Input {...form.register("houseSize")} placeholder="House Size (optional)" />
          <Input {...form.register("location")} placeholder="Location" />
        </section>

        <Separator />

        {/* Pricing */}
        <section className="space-y-4">
          <h2 className="font-semibold">Pricing</h2>

          <Input
            type="number"
            {...form.register("basePrice", { valueAsNumber: true })}
            placeholder="Base Price"
          />
          <Input
            type="number"
            {...form.register("discount", { valueAsNumber: true })}
            placeholder="Discount"
          />
        </section>

        <Separator />

        {/* Terms */}
        <section className="space-y-4">
          <h2 className="font-semibold">Terms</h2>

          <Input {...form.register("paymentTerms")} placeholder="Payment Terms" />
          <Input
            {...form.register("deliveryTimeline")}
            placeholder="Delivery Timeline"
          />
          <Input {...form.register("validityPeriod")} placeholder="Validity Period" />
        </section>

        <Separator />

        {/* Notes */}
        <section className="space-y-4">
          <h2 className="font-semibold">Notes</h2>
          <Textarea {...form.register("notes")} placeholder="Internal notes" />
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="bg-[#8B5E3C] text-white"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}

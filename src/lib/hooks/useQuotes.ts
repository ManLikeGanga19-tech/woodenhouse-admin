import { useQuery } from "@tanstack/react-query";
import { Quote } from "@/types";
import { mockQuotes } from "@/lib/utils/mockData";

export const useQuotes = () => {
    return useQuery<Quote[]>({
        queryKey: ["quotes"],
        queryFn: async () => {
            // Replace with API call later
            return mockQuotes;
        },
    });
};

export const useQuote = (id: string) => {
    return useQuery<Quote | undefined>({
        queryKey: ["quotes", id],
        queryFn: async () => {
            return mockQuotes.find((q) => q.id === id);
        },
        enabled: !!id,
    });
};

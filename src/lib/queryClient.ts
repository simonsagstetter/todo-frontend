import { QueryClient } from "@tanstack/query-core";

const queryClient = new QueryClient( {
    defaultOptions: {
        queries: {
            staleTime: 0,
            gcTime: 0,
            retry: false
        }
    }
} )

export { queryClient };
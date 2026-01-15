import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

import { UnitProvider } from "../features/unit-toggle/model/UnitContext";
import { TimeFormatProvider } from "../features/time-format/model/TimeFormatContext";

export const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <UnitProvider>
        <TimeFormatProvider>{children}</TimeFormatProvider>
      </UnitProvider>
    </QueryClientProvider>
  );
};

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchSite, siteQueryKey } from "./fetch-site";

export function useSite() {
  return useQuery({
    queryKey: siteQueryKey,
    queryFn: () => fetchSite(),
  });
}

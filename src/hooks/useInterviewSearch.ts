import { useQuery } from "@tanstack/react-query";

async function fetchSearch(term: string) {
  if (!term) return [];                                   // no call on empty term
  const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
  if (!res.ok) throw new Error("Network error");
  return res.json();                                      // → Interview[]
}

export default function useInterviewSearch(term: string) {
  return useQuery({
    queryKey: ["interviewSearch", term],
    queryFn: () => fetchSearch(term),
    enabled: !!term,                                      
    staleTime: 1000 * 60 * 5,
  });
}

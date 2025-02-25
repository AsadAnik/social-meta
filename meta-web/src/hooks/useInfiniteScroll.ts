import { useEffect, useRef, useCallback, type RefObject } from "react";

export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean,
  isLoading: boolean
): { loaderRef: RefObject<HTMLDivElement> } {
  const loaderRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !isLoading) {
        callback();
      }
    },
    [callback, hasMore, isLoading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "200px", // Adjust this margin as needed
      threshold: 0.1,
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleIntersect]);

  return { loaderRef: loaderRef as RefObject<HTMLDivElement> };
}
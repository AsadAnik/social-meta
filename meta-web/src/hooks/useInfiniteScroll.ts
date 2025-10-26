import { useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
    isLoading: boolean;
    hasNextPage: boolean;
    onLoadMore: () => void;
}

export const useInfiniteScroll = ({ isLoading, hasNextPage, onLoadMore }: UseInfiniteScrollOptions) => {
    const observer = useRef<IntersectionObserver>();

    const loaderRef = useCallback(
        (node: HTMLElement | null) => {
            if (isLoading) return;

            if (observer.current) {
                observer.current.disconnect();
            }

            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    onLoadMore();
                }
            });

            if (node) {
                observer.current.observe(node);
            }
        },
        [isLoading, hasNextPage, onLoadMore]
    );

    return { loaderRef };
};

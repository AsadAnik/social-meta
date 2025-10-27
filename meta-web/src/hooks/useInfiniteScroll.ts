import { useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
    isLoading: boolean;
    hasNextPage: boolean;
    onLoadMore: () => void;
}

/**
 * A custom hook to implement infinite scrolling functionality.
 * @param {Object} options - Configuration options for the hook.
 * @param {boolean} options.isLoading - Indicator whether a loading operation is currently in progress.
 * @param {boolean} options.hasNextPage - Indicator whether there are more items to load.
 * @param {Function} options.onLoadMore - A callback function to be invoked when the element is in view and additional data needs to be fetched.
 * @returns {Object} - An object containing the `loaderRef`, a callback ref to assign to the target element for observing.
 */
export const useInfiniteScroll = ({ isLoading, hasNextPage, onLoadMore }: UseInfiniteScrollOptions): object => {
    const observer = useRef<IntersectionObserver>(null);

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

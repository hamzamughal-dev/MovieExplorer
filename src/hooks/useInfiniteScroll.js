import { useRef, useCallback } from 'react';

export function useInfiniteScroll({ isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, disabled = false }) {
    const observer = useRef();

    const lastElementRef = useCallback(node => {
        if (isLoading || isFetchingNextPage || disabled) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, isFetchingNextPage, disabled, hasNextPage, fetchNextPage]);

    return lastElementRef;
}

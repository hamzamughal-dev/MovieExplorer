import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash.debounce';

export function useDebouncedSearch(paramName = 'q', delay = 500) {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get(paramName) ?? '';
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

    const updateSearch = useMemo(
        () =>
            debounce((value) => {
                setDebouncedQuery(value);
                setSearchParams(
                    (prev) => {
                        const next = new URLSearchParams(prev);
                        if (value.trim()) {
                            next.set(paramName, value.trim());
                        } else {
                            next.delete(paramName);
                        }
                        return next;
                    },
                    { replace: true }
                );
            }, delay),
        [setSearchParams, paramName, delay]
    );

    useEffect(() => {
        return () => updateSearch.cancel();
    }, [updateSearch]);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        updateSearch(val);
    };

    const handleClearSearch = () => {
        updateSearch.cancel();
        setSearchQuery('');
        setDebouncedQuery('');
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.delete(paramName);
                return next;
            },
            { replace: true }
        );
    };

    return {
        searchQuery,
        debouncedQuery,
        handleSearchChange,
        handleClearSearch,
    };
}

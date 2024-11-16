import { useState, useEffect } from 'react';

const useInfiniteScroll = (fetchData, initialPage = 1, itemsPerPage = 5) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch initial data on mount
        fetchMoreData(currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchMoreData = (page) => {
        if (isLoading) return; 
        setIsLoading(true);

        fetchData(page, itemsPerPage)
            .then(({ items, total }) => {
                setData((prevData) => [...prevData, ...items]);
                setHasMore(data.length + items.length < total); 
                setCurrentPage(page);
            })
            .catch((err) => {
                console.error('Error fetching data:', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const loadMore = () => {
        if (hasMore && !isLoading) {
            fetchMoreData(currentPage + 1);
        }
    };

    return { data, hasMore, isLoading, loadMore };
};

export default useInfiniteScroll;

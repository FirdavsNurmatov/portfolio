import { useEffect, useState } from "react";
import { instance } from "../config/axios-instance";
import type { NewsItem } from "./useNews";

export const useBlogNews = (
    category?: string,
    page = 1,
    limit = 6,
    sort = "latest"
) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await instance.get("/news", {
                    params: { category, page, limit, sort },
                });
                setNews(res.data.data);
                setHasMore(res.data.hasMore);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [category, page, sort]);

    return { news, loading, hasMore };
};

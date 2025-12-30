import { useState, useEffect, useCallback } from "react";
import { instance } from "../config/axios-instance";

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  publishedAt: string;
  myReaction: "LIKE" | "DISLIKE" | null;
  likes: {
    like: number;
    dislike: number;
  };
  comments: {
    id: string;
    content: string;
    user: { id: string; name: string };
  }[];
}

export const useNews = (category?: string) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchNews = useCallback(
    async (reset = false) => {
      if (loading) return;

      setLoading(true);
      try {
        const res = await instance.get("/news", {
          params: {
            category,
            page: reset ? 1 : page,
            limit: 5,
          },
        });

        setNews((prev) =>
          reset ? res.data.data : [...prev, ...res.data.data]
        );

        setHasMore(res.data.hasMore);
        setPage((prev) => (reset ? 2 : prev + 1));
      } finally {
        setLoading(false);
      }
    },
    [category, page, loading]
  );

  // 🔥 category o‘zgarsa — reset bilan fetch
  useEffect(() => {
    setNews([]);
    setPage(1);
    setHasMore(true);
    fetchNews(true);
  }, [category]);

  return { news, loading, fetchNews, hasMore };
};

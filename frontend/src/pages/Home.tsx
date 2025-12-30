import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Stack,
    Card,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState, useRef, useCallback } from "react";
import { useNews } from "../hooks/useNews";
import NewsCard from "../components/News/NewsCard";

// Container
const HomeContainer = styled(Stack)(({ theme }) => ({
    minHeight: "100dvh",
    padding: theme.spacing(2),
    [theme.breakpoints.up("sm")]: { padding: theme.spacing(4) },
    position: "relative",
    backgroundColor: theme.palette.background.default,
}));

// Card
const HomeCard = styled(Card)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    [theme.breakpoints.up("sm")]: { maxWidth: "700px" },
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
}));

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState<
        string | undefined
    >(undefined);

    const { news, loading, fetchNews, hasMore } = useNews(selectedCategory);

    const categories = [
        "general",
        "technology",
        "business",
        "science",
        "health",
    ];

    const observer = useRef<IntersectionObserver | null>(null);

    const lastNewsRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;

            if (observer.current) observer.current.disconnect();

            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    fetchNews();
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore, fetchNews]
    );

    return (
        <HomeContainer direction="column" spacing={2}>
            <HomeCard>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Welcome to News Platform
                </Typography>

                {/* Category Buttons */}
                <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                    <Button
                        variant={selectedCategory === undefined ? "contained" : "outlined"}
                        onClick={() => setSelectedCategory(undefined)}
                    >
                        All
                    </Button>

                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={selectedCategory === cat ? "contained" : "outlined"}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </Box>

                {/* News List */}
                <Stack spacing={2}>
                    {news.map((n, index) => {
                        if (index === news.length - 1) {
                            return (
                                <div ref={lastNewsRef} key={n.id}>
                                    <NewsCard news={n} refreshNews={fetchNews} />
                                </div>
                            );
                        }

                        return (
                            <NewsCard key={n.id} news={n} refreshNews={fetchNews} />
                        );
                    })}
                </Stack>

                {/* Loader */}
                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* End text */}
                {!hasMore && !loading && (
                    <Typography align="center" color="text.secondary">
                        You’ve reached the end 👋
                    </Typography>
                )}
            </HomeCard>
        </HomeContainer>
    );
}

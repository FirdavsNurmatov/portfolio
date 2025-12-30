import {
    Box,
    Typography,
    Stack,
    Card,
    Button,
    Pagination,
    Select,
    MenuItem,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useBlogNews } from "../hooks/useBlogNews";
import BlogNewsSkeleton from "../components/News/BlogNewsSkeleton";

const BlogContainer = styled(Stack)(({ theme }) => ({
    minHeight: "100dvh",
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
}));

const BlogCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
}));

const categories = [
    "general",
    "technology",
    "business",
    "science",
    "health",
];

export default function Blog() {
    const [params, setParams] = useSearchParams();

    const page = Number(params.get("page") || 1);
    const category = params.get("category") || undefined;
    const [sort, setSort] = useState(params.get("sort") || "latest");

    const { news, loading, hasMore } = useBlogNews(category, page, 6, sort);

    const handlePageChange = (_: any, value: number) => {
        setParams({ page: value.toString(), ...(category && { category }), sort });
    };

    const handleCategory = (cat?: string) => {
        setParams({
            page: "1",
            ...(cat && { category: cat }),
            sort,
        });
    };

    const handleSortChange = (value: string) => {
        setSort(value);
        setParams({
            page: "1",
            ...(category && { category }),
            sort: value,
        });
    };

    return (
        <BlogContainer spacing={3}>
            <Typography variant="h4">Blog</Typography>

            {/* Category filter + Sort */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                        variant={!category ? "contained" : "outlined"}
                        onClick={() => handleCategory()}
                    >
                        All
                    </Button>
                    {categories.map(cat => (
                        <Button
                            key={cat}
                            variant={category === cat ? "contained" : "outlined"}
                            onClick={() => handleCategory(cat)}
                        >
                            {cat}
                        </Button>
                    ))}
                </Box>

                <Select
                    value={sort}
                    onChange={(e) => handleSortChange(e.target.value)}
                    size="small"
                >
                    <MenuItem value="latest">Latest</MenuItem>
                    <MenuItem value="popular">Most liked</MenuItem>
                </Select>
            </Box>

            {/* News List */}
            {loading ? (
                <BlogNewsSkeleton count={6} />
            ) : (
                <Stack spacing={2}>
                    {news.length ? (
                        news.map(n => (
                            <BlogCard key={n.id}>
                                <Typography variant="h6">{n.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {n.description}
                                </Typography>

                                <Typography variant="caption" color="text.secondary">
                                    {new Date(n.publishedAt).toLocaleDateString()} • {n.category}
                                </Typography>

                                <Button size="small" href={`/news/${n.id}`}>
                                    Read more →
                                </Button>
                            </BlogCard>
                        ))
                    ) : (
                        <Typography>No news found for this category.</Typography>
                    )}
                </Stack>
            )}

            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                    page={page}
                    count={hasMore ? page + 1 : page}
                    onChange={handlePageChange}
                />
            </Box>
        </BlogContainer>
    );
}

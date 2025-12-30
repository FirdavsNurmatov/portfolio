import {
    Box,
    Typography,
    Card,
    CardMedia,
    IconButton,
    Stack,
    TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { instance } from "../config/axios-instance";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import AddCommentIcon from "@mui/icons-material/AddComment";

export default function NewsDetail() {
    const { id } = useParams();

    const [news, setNews] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");

    // State for like/dislike counts and myReaction
    const [myReaction, setMyReaction] = useState<"LIKE" | "DISLIKE" | null>(null);
    const [likesCount, setLikesCount] = useState(0);
    const [dislikesCount, setDislikesCount] = useState(0);
    const [comments, setComments] = useState<any[]>([]);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const res = await instance.get(`/news/${id}`);
            const data = res.data;
            setNews(data);

            // update local states
            setMyReaction(data.myReaction);
            setLikesCount(data.likes?.like || 0);
            setDislikesCount(data.likes?.dislike || 0);
            setComments(data.comments || []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, [id]);

    const handleLike = async () => {
        if (!news) return;

        await instance.post(`/news/${id}/like`);

        // update UI instantly
        if (myReaction === "LIKE") {
            setMyReaction(null);
            setLikesCount(likesCount - 1);
        } else {
            setMyReaction("LIKE");
            setLikesCount(likesCount + 1);
            if (myReaction === "DISLIKE") setDislikesCount(dislikesCount - 1);
        }
    };

    const handleDislike = async () => {
        if (!news) return;

        await instance.post(`/news/${id}/dislike`);

        if (myReaction === "DISLIKE") {
            setMyReaction(null);
            setDislikesCount(dislikesCount - 1);
        } else {
            setMyReaction("DISLIKE");
            setDislikesCount(dislikesCount + 1);
            if (myReaction === "LIKE") setLikesCount(likesCount - 1);
        }
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;
        const res = await instance.post(`/news/${id}/comment`, { content: comment });

        // add comment locally
        setComments((prev) => [...prev, res.data]);
        setComment("");
    };

    if (loading || !news) return <div>Loading...</div>;

    return (
        <Box sx={{ p: 4 }}>
            <Card>
                {news.imageUrl && (
                    <CardMedia component="img" height="300" image={news.imageUrl} />
                )}
                <Box sx={{ p: 3 }}>
                    <Typography variant="h4">{news.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {new Date(news.publishedAt).toLocaleDateString()} • {news.category}
                    </Typography>
                    <Typography variant="body1">{news.description}</Typography>

                    {/* Like / Dislike */}
                    <Box sx={{ display: "flex", gap: 1, mt: 2, alignItems: "center" }}>
                        <IconButton onClick={handleLike} color={myReaction === 'LIKE' ? "primary" : "default"}>
                            {myReaction === "LIKE" ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                        </IconButton>
                        <Typography>{likesCount}</Typography>

                        <IconButton onClick={handleDislike} color={myReaction === 'DISLIKE' ? "error" : "default"}>
                            {myReaction === "DISLIKE" ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
                        </IconButton>
                        <Typography>{dislikesCount}</Typography>
                    </Box>

                    {/* Comments */}
                    <Stack spacing={1} sx={{ mt: 2 }}>
                        {comments.map((c: any) => (
                            <Typography key={c.id} variant="body2">
                                <strong>{c.user?.name}:</strong> {c.content}
                            </Typography>
                        ))}

                        {/* Add Comment */}
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Add comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <IconButton onClick={handleAddComment}>
                                <AddCommentIcon />
                            </IconButton>
                        </Box>
                    </Stack>
                </Box>
            </Card>
        </Box>
    );
}

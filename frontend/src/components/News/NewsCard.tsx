import { Card, CardContent, CardMedia, Typography, Box, TextField, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import type { NewsItem } from "../../hooks/useNews";
import { instance } from "../../config/axios-instance";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import AddCommentIcon from '@mui/icons-material/AddComment';

interface Props {
    news: NewsItem;
    refreshNews: () => void;
}

export default function NewsCard({ news, refreshNews }: Props) {
    const [comment, setComment] = useState("");
    const [myReaction, setMyReaction] = useState<"LIKE" | "DISLIKE" | null>(news.myReaction);
    const [likesCount, setLikesCount] = useState(news.likes.like);
    const [dislikesCount, setDislikesCount] = useState(news.likes.dislike);
    const [comments, setComments] = useState(news.comments);

    // parentdan news update bo'lsa lokal state ham yangilanadi
    useEffect(() => {
        setMyReaction(news.myReaction);
        setLikesCount(news.likes.like);
        setDislikesCount(news.likes.dislike);
        setComments(news.comments);
    }, [news]);

    const handleLike = async () => {
        const newReaction = myReaction === 'LIKE' ? null : 'LIKE';

        // instant UI update
        setMyReaction(newReaction);
        setLikesCount(prev => newReaction === 'LIKE' ? prev + 1 : prev - 1);
        if (myReaction === 'DISLIKE') setDislikesCount(prev => prev - 1);

        await instance.post(`/news/${news.id}/like`);
        refreshNews();
    };

    const handleDislike = async () => {
        const newReaction = myReaction === 'DISLIKE' ? null : 'DISLIKE';

        // instant UI update
        setMyReaction(newReaction);
        setDislikesCount(prev => newReaction === 'DISLIKE' ? prev + 1 : prev - 1);
        if (myReaction === 'LIKE') setLikesCount(prev => prev - 1);

        await instance.post(`/news/${news.id}/dislike`);
        refreshNews();
    };

    const handleAddComment = async () => {
        if (!comment.trim()) return;

        const newComment = { id: Date.now().toString(), content: comment, user: { id: "me", name: "You" } };
        setComments(prev => [...prev, newComment]); // instant UI update
        setComment("");

        await instance.post(`/news/${news.id}/comment`, { content: comment });
        refreshNews();
    };

    return (
        <Card sx={{ mb: 2 }}>
            {news.imageUrl && <CardMedia component="img" height="200" image={news.imageUrl} />}
            <CardContent>
                <Typography variant="h6">{news.title}</Typography>
                <Typography variant="body2" color="text.secondary">{news.description}</Typography>

                {/* Like / Dislike tugmalari */}
                <Box sx={{ display: "flex", gap: 1, mt: 1, alignItems: "center" }}>
                    <IconButton onClick={handleLike} color={myReaction === 'LIKE' ? "primary" : "default"}>
                        {myReaction === 'LIKE' ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
                    </IconButton>
                    <Typography>{likesCount}</Typography>

                    <IconButton onClick={handleDislike} color={myReaction === 'DISLIKE' ? "error" : "default"}>
                        {myReaction === 'DISLIKE' ? <ThumbDownAltIcon /> : <ThumbDownOffAltIcon />}
                    </IconButton>
                    <Typography>{dislikesCount}</Typography>
                </Box>

                {/* Comments */}
                <Box sx={{ mt: 1 }}>
                    {comments.map((c) => (
                        <Typography key={c.id} variant="body2">
                            <strong>{c.user?.name}:</strong> {c.content}
                        </Typography>
                    ))}
                </Box>

                {/* Add comment */}
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <TextField
                        placeholder="Add comment..."
                        size="small"
                        fullWidth
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <IconButton onClick={handleAddComment}>
                        <AddCommentIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
}

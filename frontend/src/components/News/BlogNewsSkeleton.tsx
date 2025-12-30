import { Skeleton, Stack, Card, Box } from "@mui/material";

export default function BlogNewsSkeleton({ count = 3 }) {
    return (
        <Stack spacing={2}>
            {Array.from({ length: count }).map((_, idx) => (
                <Card key={idx} sx={{ p: 2 }}>
                    <Skeleton variant="rectangular" height={150} />
                    <Box sx={{ mt: 1 }}>
                        <Skeleton variant="text" height={30} width="80%" />
                        <Skeleton variant="text" height={20} width="60%" />
                    </Box>
                </Card>
            ))}
        </Stack>
    );
}

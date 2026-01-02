import { Box, Typography, Divider, Link, Stack } from "@mui/material";

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                mt: 6,
                py: 4,
                px: { xs: 2, sm: 4 },
                backgroundColor: "background.paper",
                borderTop: 1,
                borderColor: "divider",
            }}
        >
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems="center"
                spacing={{ xs: 2, sm: 0 }}
            >
                {/* Author & Developer */}
                <Stack spacing={0.5} alignItems={{ xs: "center", sm: "flex-start" }}>
                    <Typography variant="body2" color="text.secondary">
                        Author: <strong>Jamshid Ruziyev</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Developer: <strong>Firdavs Nurmatov</strong>
                    </Typography>
                </Stack>

                {/* Contact Emails */}
                <Stack spacing={0.5} alignItems={{ xs: "center", sm: "flex-end" }}>
                    <Typography variant="body2" color="text.secondary">
                        Email: <Link href="mailto:ruziyev.youngla@gmail.com">ruziyev.youngla@gmail.com</Link>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Email: <Link href="mailto:nurmatovfirdavs96@gmail.com">nurmatovfirdavs96@gmail.com</Link>
                    </Typography>
                </Stack>
            </Stack>

            {/* Divider */}
            <Divider sx={{ my: 2 }} />

            {/* Copyright */}
            <Typography
                variant="body2"
                color="text.secondary"
                align="center"
            >
                © {new Date().getFullYear()} MyBlog. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;

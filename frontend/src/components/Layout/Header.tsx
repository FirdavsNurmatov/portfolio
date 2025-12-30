import { AppBar, Toolbar, Typography, Button, Box, IconButton, useTheme } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import { Link as RouterLink, useLocation } from "react-router-dom";

type Props = {
    onToggleTheme: () => void;
    mode: "light" | "dark";
};

const Header = ({ onToggleTheme, mode }: Props) => {
    const theme = useTheme();
    const location = useLocation(); // current URL

    // active class aniqlash
    const isActive = (path: string) => location.pathname === path;

    return (
        <AppBar
            position="static"
            elevation={1}
            sx={{
                backgroundColor: theme.palette.background.paper,
                borderBottom: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                }}
            >
                {/* Logo + Navigation */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/home"
                        sx={{
                            textDecoration: "none",
                            color: theme.palette.text.primary,
                            fontWeight: 700,
                        }}
                    >
                        MyBlog
                    </Typography>

                    {["/home", "/blog"].map((path) => (
                        <Button
                            key={path}
                            color="inherit"
                            component={RouterLink}
                            to={path}
                            sx={{
                                color: theme.palette.text.primary,
                                fontWeight: isActive(path) ? 700 : 400,
                                borderBottom: isActive(path) ? `2px solid ${theme.palette.primary.main}` : "none",
                                borderRadius: 0,
                                "&:hover": {
                                    color: theme.palette.primary.main,
                                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                                },
                            }}
                        >
                            {path === "/home" ? "Home" : "Blog"}
                        </Button>
                    ))}
                </Box>

                {/* Actions */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                        onClick={onToggleTheme}
                        sx={{
                            backgroundColor: theme.palette.action.hover,
                            "&:hover": { backgroundColor: theme.palette.action.selected },
                        }}
                    >
                        {mode === "light" ? <LightModeIcon color="primary" /> : <DarkModeIcon color="primary" />}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;

"use client";

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { AppBar, Toolbar, Typography, Container, Box, Button, IconButton, useMediaQuery, Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import Link from "next/link";
import { useState } from "react";

const theme = createTheme({
  palette: {
    primary: { 
      main: "#10A84F",
      light: "#4EC274",
      dark: "#0A7A3A",
      contrastText: "#FFFFFF"
    },
    secondary: { 
      main: "#25313C",
      light: "#4A5568",
      dark: "#1A2329",
      contrastText: "#FFFFFF"
    },
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(0,0,0,0.05)",
    "0px 4px 8px rgba(0,0,0,0.08)",
    "0px 8px 16px rgba(0,0,0,0.1)",
    "0px 12px 24px rgba(0,0,0,0.12)",
    "0px 16px 32px rgba(0,0,0,0.14)",
    ...Array(19).fill("none"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(16, 168, 79, 0.3)",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "0px 6px 16px rgba(16, 168, 79, 0.4)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
            transform: "translateY(-4px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: "Episodes", href: "/episodes" },
    { label: "Admin", href: "/admin" },
  ];

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: "linear-gradient(135deg, #10A84F 0%, #0A7A3A 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Toolbar sx={{ py: { xs: 1, md: 1.5 } }}>
          <Typography
            variant="h6"
            component={Link}
            href="/"
            sx={{
              flexGrow: { xs: 1, md: 0 },
              textDecoration: "none",
              color: "inherit",
              fontWeight: 700,
              fontSize: { xs: "1.1rem", md: "1.25rem" },
              letterSpacing: "-0.02em",
            }}
          >
            Mike&apos;s MongoDB Minute
          </Typography>
          
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: "flex", gap: 1, ml: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  sx={{
                    color: "white",
                    fontWeight: 500,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: { width: 280, pt: 2 },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Menu
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItem component={Link} href="/" onClick={handleDrawerToggle} sx={{ textDecoration: "none", color: "inherit" }}>
            <ListItemText primary="Home" />
          </ListItem>
          {navItems.map((item) => (
            <ListItem
              key={item.href}
              component={Link}
              href={item.href}
              onClick={handleDrawerToggle}
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navigation />
          <Box sx={{ minHeight: "calc(100vh - 64px)", backgroundColor: "background.default" }}>
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
              {children}
            </Container>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}

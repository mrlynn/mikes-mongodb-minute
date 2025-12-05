"use client";

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { AppBar, Toolbar, Typography, Container, Box, Button, IconButton, useMediaQuery, Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon, HelpOutline as HelpIcon } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const theme = createTheme({
  palette: {
    primary: { 
      main: "#00684A", // MongoDB official brand green
      light: "#00ED64", // MongoDB UI green
      dark: "#004D37",
      contrastText: "#FFFFFF"
    },
    secondary: { 
      main: "#001E2B", // MongoDB dark teal
      light: "#003D52",
      dark: "#000F15",
      contrastText: "#FFFFFF"
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#001E2B",
      secondary: "#5F6C76",
    },
    grey: {
      50: "#F7FAFC",
      100: "#EDF2F7",
      200: "#E2E8F0",
      300: "#CBD5E0",
      400: "#A0AEC0",
      500: "#718096",
      600: "#4A5568",
      700: "#2D3748",
      800: "#1A202C",
      900: "#171923",
    },
  },
  typography: {
    fontFamily: '"Inter", "Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#001E2B",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#001E2B",
    },
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: "#001E2B",
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: "#001E2B",
    },
    h5: {
      fontWeight: 600,
      color: "#001E2B",
    },
    h6: {
      fontWeight: 600,
      color: "#001E2B",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
    body1: {
      color: "#001E2B",
    },
    body2: {
      color: "#5F6C76",
    },
  },
  shape: {
    borderRadius: 6,
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
          borderRadius: 6,
          padding: "8px 16px",
          fontSize: "0.875rem",
          fontWeight: 500,
          textTransform: "none",
          boxShadow: "none",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "none",
          },
        },
        contained: {
          backgroundColor: "#00684A",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#004D37",
            boxShadow: "0px 2px 4px rgba(0, 104, 74, 0.2)",
          },
        },
        outlined: {
          borderColor: "#CBD5E0",
          color: "#001E2B",
          "&:hover": {
            borderColor: "#00684A",
            backgroundColor: "rgba(0, 104, 74, 0.04)",
          },
        },
        text: {
          color: "#001E2B",
          "&:hover": {
            backgroundColor: "rgba(0, 104, 74, 0.04)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.08), 0px 1px 2px rgba(0, 0, 0, 0.04)",
          border: "1px solid #E2E8F0",
          transition: "all 0.2s ease",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)",
            borderColor: "#CBD5E0",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: "1px solid #E2E8F0",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 6,
            backgroundColor: "#FFFFFF",
            "& fieldset": {
              borderColor: "#CBD5E0",
            },
            "&:hover fieldset": {
              borderColor: "#A0AEC0",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00684A",
              borderWidth: "1.5px",
            },
          },
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
    { label: "Admin", href: "/admin" },
  ];

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          color: "#001E2B",
        }}
      >
        <Toolbar sx={{ py: { xs: 1, md: 1.5 }, px: { xs: 2, md: 3 } }}>
          <Box
            component={Link}
            href="/"
            sx={{
              flexGrow: { xs: 1, md: 0 },
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Image
              src="/logo.png"
              alt="MongoDB Minute Logo"
              width={40}
              height={40}
              style={{ display: "block" }}
            />
            <Typography
              variant="h6"
              sx={{
                color: "#001E2B",
                fontWeight: 600,
                fontSize: { xs: "1rem", md: "1.125rem" },
                letterSpacing: "-0.01em",
              }}
            >
              MongoDB Minute
            </Typography>
          </Box>
          
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: "flex", gap: 0.5, ml: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  component={Link}
                  href={item.href}
                  variant="text"
                  sx={{
                    color: "#5F6C76",
                    fontWeight: 500,
                    px: 2,
                    fontSize: "0.875rem",
                    "&:hover": {
                      backgroundColor: "rgba(0, 104, 74, 0.04)",
                      color: "#001E2B",
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Help/Documentation Button */}
          <IconButton
            component="a"
            href="https://docs.mongodbminute.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="documentation"
            data-tour="help-button"
            sx={{
              color: "#5F6C76",
              mr: isMobile ? 1 : 0,
              "&:hover": {
                backgroundColor: "rgba(0, 104, 74, 0.08)",
                color: "#00684A",
              },
            }}
          >
            <HelpIcon />
          </IconButton>

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
          <Divider sx={{ my: 1 }} />
          <ListItem
            component={Link}
            href="/legal/terms"
            onClick={handleDrawerToggle}
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemText primary="Terms of Service" />
          </ListItem>
          <ListItem
            component={Link}
            href="/legal/privacy"
            onClick={handleDrawerToggle}
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemText primary="Privacy Policy" />
          </ListItem>
          <ListItem
            component={Link}
            href="/legal/cookies"
            onClick={handleDrawerToggle}
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemText primary="Cookie Policy" />
          </ListItem>
          <ListItem
            component="a"
            href="https://docs.mongodbminute.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              gap: 1,
            }}
          >
            <HelpIcon sx={{ color: "#5F6C76" }} />
            <ListItemText
              primary="Documentation"
              secondary="docs.mongodbminute.com"
              slotProps={{
                secondary: {
                  sx: { fontSize: "0.75rem", color: "#A0AEC0" }
                }
              }}
            />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navigation />
          <Box sx={{ minHeight: "calc(100vh - 64px)", backgroundColor: "#F7FAFC", display: "flex", flexDirection: "column" }}>
            <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 }, flex: 1 }}>
              {children}
            </Container>
            <Box
              component="footer"
              sx={{
                mt: "auto",
                py: 4,
                px: { xs: 2, md: 3 },
                borderTop: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Container maxWidth="lg">
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", md: "center" },
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ color: "#5F6C76", fontSize: "0.875rem", mb: 1 }}>
                      © {new Date().getFullYear()} MongoDB Minute. All rights reserved.
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#A0AEC0", fontSize: "0.75rem" }}>
                      Educational MongoDB tips and tutorials
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      flexWrap: "wrap",
                      gap: { xs: 1.5, md: 3 },
                      alignItems: { xs: "flex-start", sm: "center" },
                    }}
                  >
                    <Box
                      component={Link}
                      href="/legal/terms"
                      sx={{
                        color: "#5F6C76",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: "#00684A",
                        },
                      }}
                    >
                      Terms of Service
                    </Box>
                    <Box
                      component={Link}
                      href="/legal/privacy"
                      sx={{
                        color: "#5F6C76",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: "#00684A",
                        },
                      }}
                    >
                      Privacy Policy
                    </Box>
                    <Box
                      component={Link}
                      href="/legal/cookies"
                      sx={{
                        color: "#5F6C76",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        transition: "color 0.2s ease",
                        "&:hover": {
                          color: "#00684A",
                        },
                      }}
                    >
                      Cookie Policy
                    </Box>
                  </Box>
                </Box>
              </Container>
            </Box>
          </Box>
        </ThemeProvider>
      </body>
    </html>
  );
}

"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  VideoLibrary as VideoLibraryIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  List as ListIcon,
  VideoCameraBack as RecorderIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: "Episodes", href: "/admin/episodes", icon: <ListIcon /> },
    { label: "Recorder", href: "/admin/recorder", icon: <RecorderIcon /> },
    { label: "Analytics", href: "/admin/analytics", icon: <AnalyticsIcon /> },
    { label: "Settings", href: "/admin/settings", icon: <SettingsIcon /> },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(135deg, #00684A 0%, #004D37 100%)",
          color: "#FFFFFF",
        }}
      >
        <Toolbar sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
          <VideoLibraryIcon
            sx={{
              mr: { xs: 1, sm: 2 },
              fontSize: { xs: 24, sm: 28, md: 32 },
              color: "#FFFFFF",
            }}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: "#FFFFFF",
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
              display: { xs: "none", sm: "block" },
            }}
          >
            MongoDB Minute - Admin
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              color: "#FFFFFF",
              fontSize: "0.875rem",
              display: { xs: "block", sm: "none" },
            }}
          >
            Admin
          </Typography>

          {/* Desktop Navigation */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                sx={{
                  color: "#FFFFFF",
                  fontWeight: pathname === item.href ? 700 : 400,
                  fontSize: "0.9375rem",
                  px: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            size="large"
            aria-label="menu"
            onClick={handleMobileMenuToggle}
            sx={{
              color: "#FFFFFF",
              display: { xs: "block", md: "none" },
              mr: 1,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Account Menu */}
          <IconButton
            size="large"
            aria-label="account"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            sx={{
              color: "#FFFFFF",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <AccountCircleIcon sx={{ fontSize: { xs: 28, md: 32 } }} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: 280,
            pt: 2,
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700} color="#001E2B">
            Navigation
          </Typography>
          <IconButton onClick={handleMobileMenuClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={handleMobileMenuClose}
                selected={pathname === item.href}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "#E6F7F0",
                    color: "#00684A",
                    "&:hover": {
                      backgroundColor: "#E6F7F0",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "#F7FAFC",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: pathname === item.href ? "#00684A" : "#5F6C76",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: pathname === item.href ? 600 : 400,
                    color: pathname === item.href ? "#00684A" : "#001E2B",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mt: 2, mb: 1 }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                handleMobileMenuClose();
                handleLogout();
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#F7FAFC",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "#5F6C76" }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  color: "#001E2B",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Container
        maxWidth="xl"
        sx={{
          flex: 1,
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {children}
      </Container>
    </Box>
  );
}

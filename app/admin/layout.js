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
} from "@mui/material";
import {
  Logout as LogoutIcon,
  VideoLibrary as VideoLibraryIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import Link from "next/link";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState(null);

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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(135deg, #00684A 0%, #004D37 100%)",
        }}
      >
        <Toolbar>
          <VideoLibraryIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            MongoDB Minute - Admin
          </Typography>

          <Button
            color="inherit"
            component={Link}
            href="/admin/episodes"
            sx={{
              mr: 2,
              fontWeight: pathname === "/admin/episodes" ? 700 : 400,
            }}
          >
            Episodes
          </Button>

          <Button
            color="inherit"
            component={Link}
            href="/admin/settings"
            sx={{
              mr: 2,
              fontWeight: pathname === "/admin/settings" ? 700 : 400,
            }}
          >
            Settings
          </Button>

          <IconButton
            size="large"
            aria-label="account"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircleIcon />
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

      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}

"use client";

import { Snackbar, Alert, AlertTitle } from "@mui/material";
import { useState, useEffect } from "react";

let toastQueue = [];
let listeners = [];

function notify(message, severity = "info", duration = 4000) {
  const id = Date.now();
  toastQueue.push({ id, message, severity, duration });
  listeners.forEach((listener) => listener([...toastQueue]));
  return id;
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  const showToast = (message, severity, duration) => {
    return notify(message, severity, duration);
  };

  const removeToast = (id) => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener([...toastQueue]));
  };

  return { toasts, showToast, removeToast };
}

function ToastProvider() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {toasts.map((toast) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={toast.duration}
          onClose={() => removeToast(toast.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{ zIndex: 1400 }}
        >
          <Alert
            onClose={() => removeToast(toast.id)}
            severity={toast.severity}
            variant="filled"
            sx={{
              backgroundColor:
                toast.severity === "success"
                  ? "#00684A"
                  : toast.severity === "error"
                  ? "#E63946"
                  : toast.severity === "warning"
                  ? "#FF6B35"
                  : "#0066CC",
              color: "#FFFFFF",
              "& .MuiAlert-icon": {
                color: "#FFFFFF",
              },
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
}

export default ToastProvider;

// Export convenience functions
export const toast = {
  success: (message, duration) => notify(message, "success", duration),
  error: (message, duration) => notify(message, "error", duration),
  warning: (message, duration) => notify(message, "warning", duration),
  info: (message, duration) => notify(message, "info", duration),
};


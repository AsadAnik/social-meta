'use client';
import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import useSocket from "@/hooks/useSocket";

export default function Notification() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useSocket("notification");

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
      <Alert onClose={() => setOpen(false)} severity="info">
        {message}
      </Alert>
    </Snackbar>
  );
}

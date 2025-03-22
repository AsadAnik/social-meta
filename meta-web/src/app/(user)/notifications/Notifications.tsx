"use client";
import React, { useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Badge
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { addNotification, markAsRead, deleteNotification } from "@/redux/slice/notificationSlice";
import { socket } from "@/lib/socket";

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.notifications);

  useEffect(() => {
    const handleNotification = (notification: any) => {
      console.log(`🔊 Received Notification:`, notification);
      dispatch(addNotification(notification));
    };
    
    socket.on("notification", (notification) => {
      console.log(`🔊 Listening for event: ${notification}`);

      dispatch(addNotification(notification));
    });

    return () => {
      console.log(`🔇 Stopping listener for: `);
      socket.off("notification");
    };
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteNotification(id));
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>
      <List>
        {notifications.length > 0 ? (
          notifications.map((notification: { id: React.Key | null | undefined; read: boolean | undefined; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; content: any; timestamp: string | number | Date; }) => (
            <React.Fragment key={notification.id}>
              <ListItem className={notification.read ? "read" : ""} onClick={() => notification.id && dispatch(markAsRead(notification.id as string))}>
                <ListItemAvatar>
                  <Badge color="primary" variant="dot" invisible={notification.read}>
                    <Avatar>
                      <NotificationsIcon />
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={notification.title}
                  secondary={`${notification.content} • ${new Date(notification.timestamp).toLocaleString()}`}
                />
                <IconButton edge="end" onClick={() => notification.id && handleDelete(notification.id as string)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))
        ) : (
          <Typography variant="body1">No notifications available</Typography>
        )}
      </List>
    </Container>
  );
}

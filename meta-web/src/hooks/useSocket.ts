import { useEffect } from "react";
import { socket } from "@/lib/socket";
import { useDispatch } from "react-redux";
import { addNotification } from "@/redux/slice/notificationSlice";

const useSocket = (eventName: string) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const callback = (data: any) => {
      console.log(`📩 Received event "${eventName}" with data:`, data);
      dispatch(addNotification(data));
    };

    socket.on(eventName, callback);

    return () => {
      console.log(`🔇 Stopping listener for "${eventName}"`);
      socket.off(eventName, callback);
    };
  }, [dispatch, eventName]);

  return socket;
};

export default useSocket;

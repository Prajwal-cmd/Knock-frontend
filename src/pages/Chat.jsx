import React, { useCallback, useEffect, useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { orange } from "../constants/color";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponent";
import FileMenu from "../components/dailog/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../utils/socket";
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from "../constants/events";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const socket = getSocket();
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState([]);
  const [oldMessages, setOldMessages] = useState([]);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user?._id, members });
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessages([]);
      setOldMessages([]);
      setMessage("");
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user?._id, members });
    };
  }, [chatId]);

  // Scroll to bottom only when new messages arrive
  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) navigate("/");
  }, [chatDetails.isError]);

  // Add old messages when they arrive and adjust scroll position to prevent jump to bottom
  // useEffect(() => {
  //   if (oldMessagesChunk.data) {
  //     const prevScrollHeight = containerRef?.current?.scrollHeight;
  //     const prevScrollTop = containerRef?.current?.scrollTop;
  //     setOldMessages((prev) => [...oldMessagesChunk.data.message, ...prev]);

  //     // Adjust scroll position to prevent jump to bottom
  //     setTimeout(() => {
  //       containerRef?.current?.scrollTop = prevScrollTop + (containerRef?.current?.scrollHeight - prevScrollHeight);
  //       setIsFetching(false);
  //     }, 0);
  //   }
  // }, [oldMessagesChunk.data]);
  useEffect(() => {
  if (oldMessagesChunk.data) {
    const container = containerRef?.current;
    if (container) {
      const prevScrollHeight = container.scrollHeight;
      const prevScrollTop = container.scrollTop;
      setOldMessages((prev) => [...oldMessagesChunk.data.message, ...prev]);

      // Adjust scroll position to prevent jump to bottom
      setTimeout(() => {
        if (container) {
          container.scrollTop = prevScrollTop + (container.scrollHeight - prevScrollHeight);
        }
        setIsFetching(false);
      }, 0);
    }
  }
}, [oldMessagesChunk.data]);


  const newMessagesHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [setMessages, chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data?.message,
        sender: {
          _id: "qyoyru",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
    [NEW_MESSAGE]: newMessagesHandler,
    [ALERT]: alertListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);
  useErrors(errors);
  
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef?.current?.scrollTop === 0 && !isFetching) {
        setPage((prev) => prev + 1)
        setIsFetching(true);
        
      }
    };
    

    const container = containerRef?.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [isFetching,containerRef?.current]);
 

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={"#efebe9"}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {isFetching && (
          <Typography
            variant="body2"
            align="center"
            sx={{ width: "100%", padding: "0.5rem", color: "#757575" }}
          >
            Loading...
          </Typography>
        )}
        {/* Render old messages */}
        {oldMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}
        {/* Render new messages */}
        {messages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

      

        {userTyping && <TypingLoader />}
        <div ref={bottomRef} />
      </Stack>

      <form style={{ height: "10%" }} onSubmit={submitHandler}>
        <Stack
          direction="row"
          height="100%"
          padding="1rem"
          alignItems="center"
          position="relative"
        >
          <IconButton
            onClick={handleFileOpen}
            sx={{
              position: "absolute",
              left: "1.5rem",
              color: orange,
            }}
          >
            <AttachFileIcon />
          </IconButton>

          <InputBox
            placeholder="Type Message Here..."
            value={message}
            onChange={messageOnChange}
            sx={{ flex: 1 }}
          />

          <IconButton
            type="submit"
            sx={{
              backgroundColor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "#795548",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </>
  );
};

export default AppLayout()(Chat);

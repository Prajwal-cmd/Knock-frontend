import { Drawer, Grid, Skeleton } from "@mui/material";
import Title from "../shared/Title";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Header from "./Header";
import ChatList from "../specific/ChatList";
import { SampleChats } from "../../constants/SampleData";
import { useNavigate, useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useMyChatQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from "../../redux/reducers/misc";
import toast from "react-hot-toast";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getSocket } from "../../utils/socket";
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from "../../constants/events";
import chatSlice, { incrementNotification, setNewMessagesAlert } from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../lib/Features";
import DeleteChatMenu from "../dailog/DeleteChatMenu";

const AppLayout = () => (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    const params = useParams();
    const dispatch =useDispatch()
    const chatId = params.chatId; // in which friend chat currently in
    const navigate = useNavigate()
    const deleteMenuAnchor = useRef(null)

    const [onlineUsers,setOnlineUsers]= useState([])

    const {isMobile} = useSelector(state=>state.misc)
    const {user} = useSelector(state=>state.auth)
    const {newMessagesAlert} = useSelector(state=>state.chat)
    
    const socket = getSocket()

    const { isLoading, data, isError, error, refetch } = useMyChatQuery("");

   useErrors([{isError,error}])

   useEffect(()=>{
    getOrSaveFromStorage({key:NEW_MESSAGE_ALERT,value:newMessagesAlert})
   },[newMessagesAlert])

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true))
      dispatch(setSelectedDeleteChat({chatId,groupChat}))
      deleteMenuAnchor.current = e.currentTarget
    };

    const handleMobileClose=()=>dispatch(setIsMobile(false))

    const newMessageAlertHandler=useCallback((data)=>{
      if(chatId === data.chatId) return
      dispatch(setNewMessagesAlert(data))
    },[chatId])

    const newRequestHandler = useCallback(()=>{
      dispatch(incrementNotification())
    },[dispatch])

    const refetchListener = useCallback(()=>{
      refetch()
      navigate("/")
    },[refetch,navigate])

    const onlineUsersListener = useCallback((data)=>{
      setOnlineUsers(data)
    },[])

    const eventHandlers={
      [NEW_MESSAGE_ALERT]:newMessageAlertHandler,
      [NEW_REQUEST]:newRequestHandler,
      [REFETCH_CHATS]:refetchListener,
      [ONLINE_USERS]:onlineUsersListener,
    }
    useSocketEvents(socket,eventHandlers)

    return (
      <>
        <Title />
        <Header />

        <DeleteChatMenu dispatch={dispatch}  deleteMenuAnchor={deleteMenuAnchor.current}/>

      {
        isLoading?<Skeleton/>:(
          <Drawer open={isMobile} onClose={handleMobileClose}>
          <ChatList
                w="70vw"
                chats={data?.chat}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
          </Drawer>
        )
      }

        <Grid container style={{ height: "calc(100vh - 4rem)", overflow: 'hidden', margin: 0  }}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
              
            }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chat}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </Grid>
          
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
              overflowY: 'auto',
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>

      
      </>
    );
  };
};
export default AppLayout;

import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/reducers/misc'
import { ExitToApp as ExitToAppIcon,Delete as DeleteIcon} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAsyncMutation } from '../../hooks/hook'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api'

const DeleteChatMenu = ({dispatch,deleteMenuAnchor}) => {

    const navigate = useNavigate()

    const {isDeleteMenu , selectedDeleteChat} = useSelector(state=>state.misc)

    const [deleteChat,_,deleteChatData] = useAsyncMutation(useDeleteChatMutation)
    const [leaveGroup,__,leaveGroupData] = useAsyncMutation(useLeaveGroupMutation)

    const isGroup = selectedDeleteChat.groupChat

    const closeHandler =()=>{
        dispatch(setIsDeleteMenu(false))
        deleteMenuAnchor  = null
    }

    const leaveGroupHandler =()=>{
        closeHandler()
        leaveGroup("Leaving...",selectedDeleteChat.chatId)
    }

    const deleteChatHandler =()=>{
        closeHandler()
        deleteChat("Deleting...",selectedDeleteChat.chatId)
    }


    useEffect(()=>{
        if(deleteChatData || leaveGroupData) navigate("/")
    },[deleteChatData,leaveGroupData])


  return (
    <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteMenuAnchor}>

    <Stack
    sx={{
        width:"10rem",
        padding:"0.5rem",
        cursor:"pointer"
    }}
    direction={"row"}
    alignItems={"center"}
    spacing={"0.5rem"}
    onClick={isGroup?leaveGroupHandler:deleteChatHandler}
    >
{
    isGroup ? <><ExitToAppIcon /> <Typography>Leave</Typography></>:<> <DeleteIcon /> <Typography>Delete</Typography> </>
}
    </Stack>

    </Menu>
  )
}

export default DeleteChatMenu
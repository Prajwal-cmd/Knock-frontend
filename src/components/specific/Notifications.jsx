import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { SampleNotification } from "../../constants/SampleData";
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const Notifications = () => {
const dispatch = useDispatch()
  const {isNotification}= useSelector(state=>state.misc)
  const {isLoading,data,error , isError} = useGetNotificationsQuery()
  useErrors([{error,isError}])

  const [acceptRequest] = useAcceptFriendRequestMutation()

  const friendRequesthandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false))
    try {
      const res = await acceptRequest({requestId:_id , accept})

      if(res?.data?.success){
        console.log("User scoket")
        toast.success(res.data?.message)
      }else{
        toast.error(res.data?.error) || "Something Went Wrong"
      }
    } catch (error) {
      toast.error( "Something Went Wrong")
    }
  };

  const closeHandler =()=>{
    dispatch(setIsNotification(false))
  }

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {
          isLoading?<Skeleton />:<>
          {data?.allRequest?.length > 0 ? (
          data?.allRequest?.map((i) => (
            <NotificationItem
              sender={i.sender}
              _id={i._id}
              handler={friendRequesthandler}
              key={i._id}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>No Notification</Typography>
        )}
          </>
        }
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar}/>

        <Typography
          variant="body1"
          sx={{
            flexFlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebKitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >{`${name} sent you a friend Request`}</Typography>


        <Stack direction={{
          xs:"column",
          sm:"row"
        }}>
          <Button onClick={()=>handler({_id,accept:true})}>Accept</Button>
          <Button color="error" onClick={()=>handler({_id,accept:false})}>Reject</Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;

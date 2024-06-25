import {
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Suspense, lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import LayoutLoader from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import { Link } from "../components/styles/StyledComponent";
import { mattBlack } from "../constants/color";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import { useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dailog/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dailog/AddMemberDialog")
);


const Group = () => {
  const chatId = useSearchParams()[0].get("group");

  const dispatch = useDispatch()
  const {isAddMember}= useSelector(state=>state.misc)

  const [updateGroup,isLoadingGroupName]= useAsyncMutation(useRenameGroupMutation)
  const [removeMember,isLoadingRemoveMember]= useAsyncMutation(useRemoveGroupMemberMutation)
  const [deleteGroup,isLoadingDeleteGroup]= useAsyncMutation(useDeleteChatMutation)

  const [isMobileOpen, setAIsMobileOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const myGroups = useMyGroupsQuery("")

  const groupdetails = useChatDetailsQuery({chatId,populate:true},{skip:!chatId})

  const [groupName, setGroupName] = useState(" ");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState(" ");
  const [members , setMembers]=  useState([])

  const errors = [{isError:myGroups.isError,error:myGroups.error},
    {isError:groupdetails.isError,error:groupdetails.error}
  ]
  useErrors(errors)


  useEffect(()=>{
    if(groupdetails.data){
      setGroupName(groupdetails.data.chat.name)
      setGroupNameUpdatedValue(groupdetails.data.name)
      setMembers(groupdetails.data.chat.members)
    }


    return ()=>{
      setGroupName("")
      setGroupNameUpdatedValue("")
      setMembers([])
      setIsEdit(false)
    }
  },[groupdetails.data])

  const navigate = useNavigate();
  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setAIsMobileOpen((prev) => !prev);
  };

  const handleMobileClose = () => setAIsMobileOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group name ...",{chatId,name:groupNameUpdatedValue})
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };
  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true))
  };

  const deleteHandler = () => {
    deleteGroup("Deleting...",chatId)
    closeConfirmDeleteHandler();
    navigate('/groups')
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing...",{chatId,userId})
  };

  // useEffect(() => {
  //   // if (groupdetails.data) {
  //   //   setGroupName(groupdetails.data.chat.name);
  //   //   setGroupNameUpdatedValue(groupdetails.data.chat.name); // Fixed to use the correct value
  //   //   setMembers(groupdetails.data.chat.members);
  //   // }else if
  //   if(chatId){
  //   setGroupName(`Group Name ${chatId}`);
  //   setGroupNameUpdatedValue(`Group Name ${chatId}`);
  //   }

  //   return () => {
  //     // before running useEffect another time
  //     setGroupName("");
  //     setGroupNameUpdatedValue("");
  //     setIsEdit(false);
  //   };
  // }, [chatId]);

  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            color: "white",
            bgcolor: mattBlack,
            ":hover": {
              bgcolor: "black",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

 

  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
          />
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4">{groupName}</Typography>
          <IconButton disabled={isLoadingGroupName} onClick={() => setIsEdit(true)}>
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  const ButtonGroup = (
    <Stack
      direction={{ xs: "column-reverse", sm: "row" }}
      spacing={"1rem"}
      p={{
        sm: "1rem",
        xs: "0",
        md: "1rem 4rem",
      }}
    >
      <Button size="large" color="error" onClick={openConfirmDeleteHandler}>
        Delete Group
      </Button>
      <Button size="large" variant="contained" onClick={openAddMemberHandler}>
        Add Member
      </Button>
    </Stack>
  );

  return myGroups.isLoading?<LayoutLoader /> : (
    <Grid container height={"100vh"}>
      <Grid
        item
        sm={4}
        bgcolor={"#d7ccc8"}
        sx={{ display: { xs: "none", sm: "block" } }}
      >
        <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>

      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IconBtns}

        {groupName && (
          <>
            {GroupName}
            <Typography
              margin={"2rem"}
              alignSelf={"flex-start"}
              variant="body1"
            >
              Members</Typography>
              <Stack
                maxWidth={"45rem"}
                width={"100%"}
                boxSizing={"border-box"}
                spacing={"2rem"}
                height={"50vh"}
                overflow={"auto"}
              >
                {/* Members */}
                
                {isLoadingRemoveMember?<CircularProgress />: members.map((i) => (
                  <UserItem
                    key={i._id}
                    user={i}
                    isAdded
                    stylling={{
                      boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem",
                    }}
                    handler={removeMemberHandler}
                  />
                ))}
              </Stack>
              {ButtonGroup}
            
          </>
        )}
      </Grid>

      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        open={isMobileOpen}
        onClose={handleMobileClose}
      >
        <GroupList w={"50vw"} myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Drawer>
    </Grid>
  );
};

const GroupList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack width={w} spacing={2}>
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem key={group._id} group={group} chatId={chatId} />
      ))
    ) : (
      <Typography variant="body1" align="center" color="textSecondary" sx={{ py: 2 }}>
        No groups available
      </Typography>
    )}
  </Stack>
);

const GroupListItem = ({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
      style={{ textDecoration: 'none' }}
    >
      <Stack direction="row" alignItems="center" spacing={2} padding={2} sx={{ borderRadius: 8, boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', transition: 'box-shadow 0.3s ease' }}>
        <AvatarCard avatar={avatar} />
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333' }}>{name}</Typography>
      </Stack>
    </Link>
  );
};



export default Group;

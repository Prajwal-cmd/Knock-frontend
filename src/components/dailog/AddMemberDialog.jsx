import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { SampleUsers } from "../../constants/SampleData";
import UserItem from "../shared/UserItem";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";

const AddMemberDialog = ({ addMember, isLoadingAddMember, chatId }) => {

  const dispatch = useDispatch()
  const {isAddMember}= useSelector(state=>state.misc)


  const [addMembers,isLoadingAddMembers]= useAsyncMutation(useAddGroupMembersMutation)

  const {isLoading,data,isError,error} = useAvailableFriendsQuery(chatId)



   const addMemberSubmitHandler =()=>{
    addMembers("Adding...",{members:selectedMembers,chatId})
    closeHandler()
   }
  const closeHandler =()=>{
    
    dispatch(setIsAddMember(false))
  }

  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((curId) => curId !== id) : [...prev, id]
    );
  };



  useErrors([{isError,error}])

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack spacing={"2rem"} width={"20rem"} p={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
          {isLoading?<Skeleton/>:data?.friends?.length > 0 ? (
            data?.friends?.map((i) => (
              <UserItem key={i._id} user={i} handler={selectMemberHandler}  isAdded={
                selectedMembers.includes(i._id)
              }/>
            ))
          ) : (
            <Typography textAlign={"center"}>No Friend</Typography>
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          
          <Button color="error" onClick={closeHandler}>Cancel</Button>
          <Button  onClick={addMemberSubmitHandler} variant="contained" disabled={isLoadingAddMembers}>
            Submit
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;

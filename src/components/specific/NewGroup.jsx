import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { SampleUsers } from "../../constants/SampleData";
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import { useAvailableFriendsQuery, useNewGroupMutation } from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const NewGroup = () => {
  const {isNewGroup} = useSelector(state => state.misc)

  const dispatch = useDispatch()

  const {isError,isLoading,error,data} = useAvailableFriendsQuery()

  const [newGroup,isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation)

  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [
    {isError,error}
  ]
  useErrors(errors)

  const selectMemberHandler = (id) => {
    
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((curId) => curId !== id) : [...prev, id]  // if already in selected , unselect it else select 
    );
  };

  const submitHandler = () => {
    if(!groupName) return toast.error("Group Name is required")

    if(selectedMembers.length < 2) return toast.error("Please select atleast 3 members")

            //creaating Group 

    newGroup("Creating...",{name:groupName,members:selectedMembers})

    closeHandler()
  };


  const closeHandler=()=>{
    dispatch(setIsNewGroup(false))
  }

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>
        <TextField
          label={"Group Name"}
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <Typography variant="body1">Members</Typography>
        <Stack>
          { isLoading? (<Skeleton />) 
          : 
          data?.friends?.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={selectMemberHandler}
              isAdded={selectedMembers.includes(user._id)}
            />
          ))}
        </Stack>

        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant="text" color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button variant="contained" onClick={submitHandler} disabled={isLoadingNewGroup}>
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;

import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import { useLazySearchUserQuery, useSendFriendRequestMutation } from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const Search = () => {
  const {isSearch} = useSelector(state=>state.misc)
  const [searchUser] = useLazySearchUserQuery()
  const [sendFriendRequest,isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation)
  const dispatch = useDispatch()


  const [search, setSearch] = useState("");
  const [users,setUsers ]= useState([])
  //const isLoadingSendFriendRequest=false //sending a friend request is in progress ?

  const addFriendHandler=async(id)=>{
      await sendFriendRequest("Sending Friend Request...",{userId:id})
}

  const searchCloseHandler=()=>{
    dispatch(setIsSearch(false))
  }


  useEffect(()=>{
    const timeOutId = setTimeout(()=>{
      searchUser(search)
      .then(({data})=>setUsers(data.user))
      .catch((e)=>console.log(e))
    },1000)

    return ()=>{
      clearTimeout(timeOutId)
    }
  },[search])


  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List>
{
    users.map((user)=>(
        <UserItem user={user} key={user._id}  handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest}/>
    ))
}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;

import { Add as AddIcon, Remove as RemoveIcon} from '@mui/icons-material'
import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material'
import React, { memo } from 'react'
import { transformImage } from '../../lib/Features'

//user is SampleUser (userprofile)
const UserItem = ({user,handler,handlerIsLoading,isAdded=false ,stylling={}}) => {     //handlerIsLoading conditionally disable the button used for adding/removing friends while a request is being sent.
    const {name, _id , avatar} = user
  return (
    <ListItem>
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"} {...stylling}>
            <Avatar src={transformImage(avatar)} />

            <Typography variant="body1" sx={{
                flexFlow:1,
                display:"-webkit-box",
                WebkitLineClamp:1,
                WebKitBoxOrient:"vertical",
                overflow:"hidden",
                textOverflow:"ellipsis",
                width:"100%"
            }}>{name}</Typography>

            <IconButton size='small' sx={{
               bgcolor:isAdded?"error.main":"primary.main",
               color:"white"

            }} onClick={()=>handler(_id)} disabled={handlerIsLoading}>   
                {
                   isAdded?<RemoveIcon />: <AddIcon />
                }
            </IconButton>
            </Stack>
        </ListItem>
  )
}

export default memo(UserItem)
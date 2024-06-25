import React, { memo } from 'react';
import { Link } from '../styles/StyledComponent'; // Assuming this handles styled links
import { Box, Stack, Typography, Paper } from '@mui/material';
import AvatarCard from './AvatarCard';

const ChatItem = ({
  avatar,
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  handleDeleteChat,
}) => {
  return (
    <Paper
      component={Link}
      to={`/chat/${_id}`}
      sx={{
        textDecoration: 'none',
        padding: 1,
        borderRadius: 1,
        backgroundColor: sameSender ? '#333' : 'white',
        color: sameSender ? 'white' : '#333',
        display: 'block',
        position: 'relative',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          backgroundColor: sameSender ? '#444' : '#f0f0f0',
        },
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        handleDeleteChat(e, _id, groupChat);
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 1 }}>
        <AvatarCard avatar={avatar} />
        <Stack sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
            {name}
          </Typography>
          {newMessageAlert && (
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
              {newMessageAlert.count} New Message
            </Typography>
          )}
        </Stack>
        {isOnline && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: 'green',
              position: 'absolute',
              top: '50%',
              right: 1,
              transform: 'translateY(-50%)',
            }}
          />
        )}
      </Stack>
    </Paper>
  );
};

export default memo(ChatItem);

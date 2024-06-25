import React from 'react';
import { Avatar, Stack, Typography } from '@mui/material';
import { Face as FaceIcon, AlternateEmail as UsernameIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material';
import moment from 'moment';
import { transformImage } from '../../lib/Features';

const Profile = ({ user }) => {
  return (
    <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: 150,
          height: 150,
          objectFit: 'cover',
          border: '4px solid #fff',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',
        }}
      />
      <ProfileCard heading="Bio" text={user?.bio} />
      <ProfileCard heading="Username" text={user?.username} Icon={<UsernameIcon />} />
      <ProfileCard heading="Name" text={user?.name} Icon={<FaceIcon />} />
      <ProfileCard heading="Joined" text={moment(user?.createdAt).fromNow()} Icon={<CalendarIcon />} />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      color="white"
      textAlign="left"
      sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '300px',
      }}
    >
      {Icon && Icon}
      <Stack>
        <Typography variant="body1">{text}</Typography>
        <Typography color="gray" variant="caption">
          {heading}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Profile;

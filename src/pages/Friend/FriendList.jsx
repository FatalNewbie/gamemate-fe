import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper } from '@mui/material';
import profilePlaceholder from '../../assets/profile_placeholder.png';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      // Replace with actual API endpoint for fetching friends
      const response = await axios.get('http://localhost:8080/friend/1'); // 현재 로그인된 유저 ID를 사용해야 합니다.
      setFriends(response.data);
    };

    fetchFriends();
  }, []);

  return (
    <Box mt={4} p={2}>
      <Typography variant="h6" sx={{ mb: 2 }}>👥 친구 목록</Typography>
      <List>
        {friends.map((friend, index) => (
          <ListItem key={index} component={Paper} sx={{ mb: 2 }}>
            <ListItemAvatar>
              <Avatar src={friend.profileImage || profilePlaceholder} />
            </ListItemAvatar>
            <ListItemText
              primary={friend.username}
              secondary={`친구 된 날짜: ${friend.friendDate}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FriendsList;

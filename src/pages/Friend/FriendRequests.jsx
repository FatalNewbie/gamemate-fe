import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Paper, Button, Grid } from '@mui/material';
import profilePlaceholder from '../../assets/profile_placeholder.png';

const FriendRequests = () => {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const receiverId = 1; // 현재 로그인된 유저 ID를 설정해야 합니다.
        const response = await axios.get(`http://localhost:8080/friend/requests/${receiverId}`);
        setFriendRequests(response.data);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    fetchFriendRequests();
  }, []);

  const handleAccept = async (requestId) => {
    // 친구 요청 수락 로직
    try {
      await axios.put('http://localhost:8080/friend/', {
        requesterId: requestId,
        receiverId: 1, // 현재 로그인된 유저 ID를 설정해야 합니다.
        status: 'ACCEPTED'
      });

      console.log(`Accepting friend request ${requestId}`);
      setFriendRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleReject = async (requestId) => {
    // 친구 요청 거절 로직
    try {
      await axios.put('http://localhost:8080/friend/', {
        requesterId: requestId,
        receiverId: 1, // 현재 로그인된 유저 ID를 설정해야 합니다.
        status: 'REJECTED'
      });

      console.log(`Rejecting friend request ${requestId}`);
      setFriendRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  return (
    <Box mt={4} p={2}>
      <Typography variant="h6" sx={{ mb: 2 }}>📨 친구 요청 목록</Typography>
      {friendRequests.length > 0 ? (
        <List>
          {friendRequests.map((request, index) => (
            <ListItem key={index} component={Paper} sx={{ mb: 2 }}>
              <Grid container alignItems="center">
                <Grid item>
                  <ListItemAvatar>
                    <Avatar src={profilePlaceholder} />
                  </ListItemAvatar>
                </Grid>
                <Grid item xs>
                  <ListItemText
                    primary={request.requester.username}
                    secondary={`요청 날짜: ${request.createdDate}`}
                  />
                </Grid>
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => handleAccept(request.requester.id)} sx={{ marginRight: '10px' }}>
                    수락
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => handleReject(request.requester.id)}>
                    거절
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>새로운 친구 요청이 없습니다.</Typography>
      )}
    </Box>
  );
};

export default FriendRequests;

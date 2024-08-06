import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Chip, Divider, Grid, IconButton, Button, Modal } from '@mui/material';
import { ChatBubbleOutline, PersonAdd, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import profilePlaceholder from '../../assets/profile_placeholder.png';
import './Recommend.css';

const Recommend = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [friendModalOpen, setFriendModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.post('http://127.0.0.1:8000/recommendation', {
        preferred_genres: [1, 1, 1, 1, 1],
        play_times: [1, 0, 0, 1, 0, 1, 1]
      });
      setUsers(response.data.similar_users);
    };
    fetchUsers();
  }, []);

  const handleFriendModalOpen = (user) => {
    setSelectedUser(user);
    setFriendModalOpen(true);
  };

  const handleFriendModalClose = () => {
    setFriendModalOpen(false);
  };

  const handleFriendRequest = async () => {
    // 친구 요청을 보내는 로직
    try {
      const requesterId = 1; // 현재 로그인된 유저 ID를 설정해야 합니다.
      const receiverId = selectedUser.id; // 선택된 유저의 ID를 설정해야 합니다.

      await axios.post('http://localhost:8080/friend/', {
        requesterId: requesterId,
        receiverId: receiverId
      });

      console.log(`Sending friend request to ${selectedUser.recommend_user}`);
      setFriendModalOpen(false);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <Box className="recommend-container">
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ marginBottom: '20px' }}
      >
        뒤로 가기
      </Button>
      <Divider sx={{ backgroundColor: 'rgba(128, 128, 128, 0.3)', width: '100%', mb: 2 }} />
      <Typography variant="h6"
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 700,
          fontSize: '14pt',
          letterSpacing: '-0.5px',
          marginBottom: '20px',
        }}>
         🕹️ 오늘의 추천 게임메이트
      </Typography>
      
      {users.map((user, index) => (
        <Paper key={index} className="user-card">
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <img src={profilePlaceholder} alt="Profile" className="profile-pic" />
            </Grid>
            <Grid item xs>
              <Box display={"flex"} justifyContent={"space-between"} alignContent={"center"} marginBottom={"7px"}>
                <Typography variant="h6"
                  sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 800,
                  fontSize: '12pt',
                  letterSpacing: '-0.5px',
                  marginTop: '5px'
                  }} className="username">
                  {user.recommend_user}
                </Typography>
                <Box className="icon-buttons" display={"flex"} alignContent={'center'}>
                  <IconButton className="icon-button">
                    <ChatBubbleOutline sx={{ fontSize: 15 }} />
                  </IconButton>
                  <IconButton className="icon-button" onClick={() => handleFriendModalOpen(user)}>
                    <PersonAdd sx={{ fontSize: 15 }} />
                  </IconButton>
                </Box>
              </Box>
              <Box className="tags" marginBottom={'3px'}>
                {user.common_genre.map((genre, index) => (
                  <Chip key={index} label={genre} className="tag" size="small" color="primary" sx={{ fontSize: '10px', fontWeight: 200 }} />
                ))}
              </Box>
              <Box className="tags">
                {user.common_play_time.map((time, index) => (
                  <Chip key={index} label={time} className="tag" size="small" color="primary" variant="outlined" sx={{ fontSize: '10px', fontWeight: 200 }} />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Modal
        open={friendModalOpen}
        onClose={handleFriendModalClose}
        aria-labelledby="friend-request-modal"
        aria-describedby="friend-request-modal-description"
      >
        <Box className="modal-box">
          <Typography
            id="friend-request-modal"
            variant="h6"
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 700,
              fontSize: '16pt',
              letterSpacing: '-0.5px',
              mb: 2,
            }}
          >
            친구 요청을 보내시겠습니까?
          </Typography>
          <Box display="flex" justifyContent="space-around">
            <Button variant="contained" color="primary" onClick={handleFriendRequest}>
              예
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleFriendModalClose}>
              아니오
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Recommend;

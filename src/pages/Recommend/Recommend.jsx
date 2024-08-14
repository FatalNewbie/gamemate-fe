import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, Chip, Divider, Grid, IconButton, Button, Modal, Snackbar, Alert, Avatar } from '@mui/material';
import { ChatBubbleOutline, PersonAdd, PersonAddDisabled, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import profilePlaceholder from '../../assets/profile_placeholder.png';
import './Recommend.css';
import { useCookies } from 'react-cookie';

const Recommend = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [friendModalOpen, setFriendModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [cookies] = useCookies(['token']);
  const navigate = useNavigate();


  const convertToFeatureArray = (data, referenceList) => {
    const featureArray = new Array(referenceList.length).fill(0);
    data.forEach(id => {
      featureArray[id - 1] = 1;
    });
    return featureArray;
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = cookies.token;
        const genresList = ['FPS', 'RPG', '전략', '액션', '시뮬레이션'];
        const timesList = ['AM 9:00 ~ AM 11:00', 'AM 11:00 ~ PM 2:00', 'PM 2:00 ~ PM 5:00', 'PM 5:00 ~ PM 8:00', 'PM 8:00 ~ PM 11:00', 'PM 11:00 ~ AM 3:00', 'AM 3:00 ~ AM 9:00'];

        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:8080/info', {
          headers: {
            Authorization: `${token}`,
          },
        });

        const user = response.data.data;
        const userFeatures = {
          preferred_genres: convertToFeatureArray(user.preferredGenres, genresList),
          play_times: convertToFeatureArray(user.playTimes, timesList),
        };

        const response2 = await axios.post(
          'http://127.0.0.1:8000/recommendation',
          userFeatures
        );

        setUsers(response2.data.similar_users);
      } catch (error) {
        console.error('Error fetching user info or recommendations:', error);
        setUsers([]);
      }
    };

    fetchUserInfo();
  }, [cookies.token]);

  const handleFriendModalOpen = (user) => {
    setSelectedUser(user);
    setFriendModalOpen(true);
  };

  const handleFriendModalClose = () => {
    setFriendModalOpen(false);
  };

  const handleCancelModalOpen = (user) => {
    setSelectedUser(user);
    setCancelModalOpen(true);
  };

  const handleCancelModalClose = () => {
    setCancelModalOpen(false);
  };

  const handleFriendRequest = async () => {
    try {
      const token = cookies.token;
      const response = await axios.post('/friend/', {
        receiverId: selectedUser.id,
      }, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const updatedUsers = users.map(user =>
        user.id === selectedUser.id ? { ...user, requested: true } : user
      );

      setUsers(updatedUsers);
      setFriendModalOpen(false);
      setSnackbarMessage(response.data.data.message);
      setIsSnackbarOpen(true);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleFriendRequestCancel = async () => {
    try {
      const token = cookies.token;
      const response2 = await axios.put('/friend/cancel', {
        receiverId: selectedUser.id,
        status: 'REJECTED',
      }, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const updatedUsers = users.map(user =>
        user.id === selectedUser.id ? { ...user, requested: false } : user
      );

      setUsers(updatedUsers);
      setCancelModalOpen(false);
      setSnackbarMessage(response2.data.data.message);
      setIsSnackbarOpen(true);
    } catch (error) {
      console.error('Error cancelling friend request:', error);
    }
  };

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };  

  return (
    <Box className="recommend-container">
      <Button
        variant="contained"
        color="primary"
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx = {{fontSize: '13px',
          backgroundColor: 'rgba(10, 8, 138, 0.8)',
          color: 'white',
          '&:hover': {
              backgroundColor: 'rgba(93, 90, 224, 0.8)',
          },
          marginBottom: '20px' 
      }}
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
              <Avatar
                  src={user.user_profile || profilePlaceholder}  // 프로필 사진이 없을 경우 기본 이미지 사용
                  alt={user.nickname}
                  sx={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    marginRight: '16px',
                    objectFit: 'contain',
                  }}
              />
            </Grid>
            <Grid item xs>
              <Box display={"flex"} justifyContent={"space-between"} alignContent={"center"} marginBottom={"7px"}>
                <Typography variant="h6"
                  sx={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 800,
                    fontSize: '13pt',
                    letterSpacing: '-0.5px',
                    marginTop: '5px'
                  }} className="username">
                  {user.recommend_user}
                </Typography>
                <Box className="icon-buttons" display={"flex"} alignContent={'center'}>
                  <IconButton
                    className="icon-button"
                    onClick={() => user.requested ? handleCancelModalOpen(user) : handleFriendModalOpen(user)}
                  >
                    {user.requested ? <PersonAddDisabled sx={{ fontSize: 15 }} /> : <PersonAdd sx={{ fontSize: 15 }} />}
                  </IconButton>
                </Box>
              </Box>
              <Box className="tags" marginBottom={'3px'}>
                {user.common_genre.map((genre, index) => (
                  <Chip key={index} 
                  label={genre} 
                  className="tag" 
                  size="small" 
                  sx = {{fontSize: '10px',
                      backgroundColor: 'rgba(10, 8, 138, 0.8)',
                      color: 'white'
                  }} />
                ))}
              </Box>
              <Box className="tags">
                {user.common_play_time.map((time, index) => (
                  <Chip key={index} 
                  label={time} 
                  className="tag" 
                  size="small" 
                  sx = {{fontSize: '10px',
                      backgroundColor: 'rgba(93, 90, 224, 0.8)',
                      color: 'white'
                  }}/>
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
              fontWeight: 600,
              fontSize: '11pt',
              letterSpacing: '-0.5px',
              mb: 2,
            }}
          >
            {selectedUser?.recommend_user}님께 친구 요청을 보내시겠습니까?
          </Typography>
          <Box display="flex" justifyContent="space-around">
            <Button
              variant="contained"
              color="primary"
              onClick={handleFriendRequest}
              sx={{
                backgroundColor: 'rgba(10, 8, 138, 0.8)',
                color: 'white',
                borderRadius: '30px',
                fontWeight: 'bold',
                '&:hover': {
                    backgroundColor: 'rgba(93, 90, 224, 0.8)',
                },
              }}
            >
              예
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleFriendModalClose}
              sx={{
                backgroundColor: '#DB5024',
                color: '#fff',
                borderRadius: '30px',
                fontWeight: 'bold',
                '&:hover': {
                    backgroundColor: '#FF6347',
                },
              }}
            >
              아니오
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={cancelModalOpen}
        onClose={handleCancelModalClose}
        aria-labelledby="cancel-request-modal"
        aria-describedby="cancel-request-modal-description"
      >
        <Box className="modal-box">
          <Typography
            id="cancel-request-modal"
            variant="h6"
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 600,
              fontSize: '11pt',
              letterSpacing: '-0.5px',
              mb: 2,
            }}
          >
            {selectedUser?.recommend_user}님께 보낸 친구 요청을 취소하시겠습니까?
          </Typography>
          <Box display="flex" justifyContent="space-around">
            <Button
              variant="contained"
              color="primary"
              onClick={handleFriendRequestCancel}
              sx={{
                backgroundColor: 'rgba(10, 8, 138, 0.8)',
                color: 'white',
                borderRadius: '30px',
                fontWeight: 'bold',
                '&:hover': {
                    backgroundColor: 'rgba(93, 90, 224, 0.8)',
                },
              }}
            >
              예
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCancelModalClose}
              sx={{
                backgroundColor: '#DB5024',
                color: '#fff',
                borderRadius: '30px',
                fontWeight: 'bold',
                '&:hover': {
                    backgroundColor: '#FF6347',
                },
              }}
            >
              아니오
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* 친구 요청 완료 및 취소 알림 */}
      <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={1000}
          onClose={handleSnackbarClose}
          anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
          }}
          sx={{
              top: '50%',
              width: '80%', 
              maxWidth: '400px', // 최대 너비 설정 (모바일 화면 대응)
              left: '50%',
              transform: 'translate(-50%, -50%)',
          }}
      >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ 
            width: '100%',
            backgroundColor: 'rgba(10, 8, 138, 0.8)', // 배경 색상
            color: '#ffffff', // 텍스트 색상
            fontSize: '11px',
            }}>
              {snackbarMessage}
          </Alert>
      </Snackbar>
    </Box>
  );
};

export default Recommend;

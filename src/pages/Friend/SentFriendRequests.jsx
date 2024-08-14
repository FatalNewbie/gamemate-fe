import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import {
    Box,
    Typography,
    List,
    ListItem,
    Avatar,
    Button,
    Modal,
    Snackbar,
    Alert,
    Paper,
    Chip,
    IconButton,
} from '@mui/material';
import {PersonAddDisabled, ArrowBack } from '@mui/icons-material';
import profilePlaceholder from '../../assets/profile_placeholder.png';
import { useNavigate } from 'react-router-dom';

const SentFriendRequests = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [cookies] = useCookies(['token']);
    const [friendRequests, setFriendRequests] = useState([]);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await axios.get('/friend/sent-requests', {
                    headers: {
                        Authorization: cookies.token,
                    },
                });
                setFriendRequests(response.data.data);
            } catch (error) {
                console.error('친구 요청 목록을 가져오는 데 실패했습니다:', error);
            }
        };

        fetchFriendRequests();
    }, [cookies.token]);

    const handleCancelModalOpen = (user) => {
        setSelectedUser(user);
        setCancelModalOpen(true);
    };
    
    const handleCancelModalClose = () => {
    setCancelModalOpen(false);
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

          setFriendRequests(prevRequests =>
            prevRequests.filter(request => request.receiver.id !== selectedUser.id)
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
        <Box sx={{ padding: 2 }}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{
                    marginBottom: 2,
                    backgroundColor: 'rgba(10, 8, 138, 0.8)',
                    '&:hover': {
                        backgroundColor: 'rgba(93, 90, 224, 0.8)',
                    },
                    borderRadius: 2,
                    textTransform: 'none',
                }}
            >
                뒤로 가기
            </Button>
            <List>
                {friendRequests.map((request, index) => (
                    <ListItem key={index} sx={{ display: 'flex', alignItems: 'center', padding: 2, marginBottom: '10px', borderRadius: '5%'}} component={Paper} elevation={3}>
                        <Avatar
                                src={request.receiver.userProfile || profilePlaceholder}  // 프로필 사진이 없을 경우 기본 이미지 사용
                                alt={request.receiver.nickname}
                                sx={{ width: 50, height: 50, marginRight: 2 }}
                            />
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight={700}>
                                {request.receiver.nickname}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {request.receiver.username}
                            </Typography>
                            <Box mt={1}>
                                <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap'}}>
                                    {request.receiver.preferredGenres.map((genre, idx) => (
                                        <Chip key={index} 
                                        label={genre} 
                                        size="small" 
                                        sx = {{fontSize: '8px',
                                            backgroundColor: 'rgba(10, 8, 138, 0.8)',
                                            color: 'white'
                                        }}/>
                                    ))}
                                </Box>
                            </Box>
                            <Box mt={1}>
                                <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap'}}>
                                    {request.receiver.playTimes.map((time, idx) => (
                                        <Chip key={index} 
                                        label={time} 
                                        size="small" 
                                        sx = {{fontSize: '8px',
                                            backgroundColor: 'rgba(93, 90, 224, 0.8)',
                                            color: 'white'
                                        }}/>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                        <IconButton
                                className="icon-button"
                                onClick={() => handleCancelModalOpen(request.receiver)}
                            >
                                {<PersonAddDisabled sx={{ fontSize: 15 }} />}
                            </IconButton>
                    </ListItem>
                ))}
            </List>

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
                    친구 요청을 취소하시겠습니까?
                </Typography>
                <Box display="flex" justifyContent="space-around">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFriendRequestCancel}
                        sx={{ backgroundColor: '#0A088A', '&:hover': { backgroundColor: '#5D5AE0' } }}
                    >
                    예
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancelModalClose}>
                    아니오
                    </Button>
                </Box>
                </Box>
            </Modal>

            

            {/* 친구 요청 취소 알림 */}
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

export default SentFriendRequests;

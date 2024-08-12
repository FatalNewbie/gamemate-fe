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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const RecievedFriendRequests = () => {
    const [cookies] = useCookies(['token']);
    const [friendRequests, setFriendRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const response = await axios.get('/friend/received-requests', {
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

    const handleAcceptModalOpen = (request) => {
        setSelectedRequest(request);
        setIsAcceptModalOpen(true);
    };

    const handleAcceptModalClose = () => {
        setIsAcceptModalOpen(false);
    };

    const handleDeclineModalOpen = (request) => {
        setSelectedRequest(request);
        setIsDeclineModalOpen(true);
    };

    const handleDeclineModalClose = () => {
        setIsDeclineModalOpen(false);
    };

    const handleFriendRequestAccept = async () => {
        try {
            const token = cookies.token;
            const response2 = await axios.put('/friend/respond', {
                requesterId: selectedRequest.requester.id,
                status: 'ACCEPTED',
            }, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            setFriendRequests(prevRequests => prevRequests.filter(request => request.requester.id !== selectedRequest.requester.id));
            setIsAcceptModalOpen(false);
            setSnackbarMessage(response2.data.data.message);
            setIsSnackbarOpen(true);
        } catch (error) {
            console.error('친구 요청 수락 중 오류 발생:', error);
        }
    };

    const handleFriendRequestDecline = async () => {
        try {
            const token = cookies.token;
            const response3 = await axios.put('/friend/respond', {
                requesterId: selectedRequest.requester.id,
                status: 'REJECTED',
            }, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            setFriendRequests(prevRequests => prevRequests.filter(request => request.requester.id !== selectedRequest.requester.id));
            setIsDeclineModalOpen(false);
            setSnackbarMessage(response3.data.data.message);
            setIsSnackbarOpen(true);
        } catch (error) {
            console.error('친구 요청 거절 중 오류 발생:', error);
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
                startIcon={<ArrowBackIcon />}
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
                    <ListItem key={index} sx={{ display: 'flex', alignItems: 'center', padding: 2, marginBottom: '10px', borderRadius: '5                                                               %'}} component={Paper} elevation={3}>
                        <Avatar sx={{ width: 50, height: 50, marginRight: 2 }}>
                            {request.requester.nickname.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" fontWeight={700}>
                                {request.requester.nickname}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {request.requester.username}
                            </Typography>
                            <Box mt={1}>
                                <Box sx={{display: 'flex', gap: 1, flexWrap: 'wrap'}}>
                                    {request.requester.preferredGenres.map((genre, idx) => (
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
                                    {request.requester.playTimes.map((time, idx) => (
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
                        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAcceptModalOpen(request)}
                                sx={{textTransform: 'none', 
                                    backgroundColor: 'rgba(10, 8, 138, 0.8)'
                                }}
                            >
                                수락
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleDeclineModalOpen(request)}
                                sx={{textTransform: 'none',
                                }}
                            >
                                거절
                            </Button>
                        </Box>
                    </ListItem>
                ))}
            </List>

            {/* 수락 확인 모달 */}
            <Modal
                open={isAcceptModalOpen}
                onClose={handleAcceptModalClose}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 1,
                }}>
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
                        {selectedRequest?.requester.nickname}님을 친구로 수락하시겠습니까?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Button variant="contained" color="primary" onClick={handleFriendRequestAccept}>
                            예
                        </Button>
                        <Button variant="outlined" color="primary" onClick={handleAcceptModalClose}>
                            아니오
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* 거절 확인 모달 */}
            <Modal
                open={isDeclineModalOpen}
                onClose={handleDeclineModalClose}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 1,
                }}>
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
                        {selectedRequest?.requester.nickname}님의 친구 요청을 거절하시겠습니까?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Button variant="contained" color="primary" onClick={handleFriendRequestDecline}>
                            예
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleDeclineModalClose}>
                            아니오
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* 친구 요청 수락 및 거절 완료 알림 */}
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

export default RecievedFriendRequests;

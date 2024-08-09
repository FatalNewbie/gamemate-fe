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

const FriendRequests = () => {
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
                const response = await axios.get('/friend/requests', {
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
            await axios.put('/friend/respond', {
                requesterId: selectedRequest.requester.id,
                status: 'ACCEPTED',
            }, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            setFriendRequests(prevRequests => prevRequests.filter(request => request.requester.id !== selectedRequest.requester.id));
            setIsAcceptModalOpen(false);
            setSnackbarMessage('친구 요청이 수락되었습니다.');
            setIsSnackbarOpen(true);
        } catch (error) {
            console.error('친구 요청 수락 중 오류 발생:', error);
        }
    };

    const handleFriendRequestDecline = async () => {
        try {
            const token = cookies.token;
            await axios.put('/friend/respond', {
                requesterId: selectedRequest.requester.id,
                status: 'REJECTED',
            }, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            setFriendRequests(prevRequests => prevRequests.filter(request => request.requester.id !== selectedRequest.requester.id));
            setIsDeclineModalOpen(false);
            setSnackbarMessage('친구 요청이 거절되었습니다.');
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
                    backgroundColor: '#1976d2',
                    '&:hover': {
                        backgroundColor: '#1565c0',
                    },
                    borderRadius: 2,
                    textTransform: 'none',
                }}
            >
                뒤로 가기
            </Button>
            <Typography variant="h5" gutterBottom>
                친구 요청 목록
            </Typography>
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
                                <Typography variant="subtitle2" fontWeight={700}>
                                    선호 장르
                                </Typography>
                                <Box>
                                    {request.requester.preferredGenres.map((genre, idx) => (
                                        <Chip
                                            key={idx}
                                            label={genre}
                                            size="small"
                                            color="primary"
                                            sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                            <Box mt={1}>
                                <Typography variant="subtitle2" fontWeight={700}>
                                    플레이 시간대
                                </Typography>
                                <Box>
                                    {request.requester.playTimes.map((time, idx) => (
                                        <Chip
                                            key={idx}
                                            label={time}
                                            size="small"
                                            color="primary"
                                            sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAcceptModalOpen(request)}
                                sx={{ textTransform: 'none' }}
                            >
                                수락
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleDeclineModalOpen(request)}
                                sx={{ textTransform: 'none' }}
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
                    <Typography variant="h6" sx={{ mb: 2 }}>
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
                    <Typography variant="h6" sx={{ mb: 2 }}>
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
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                sx={{
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '80%', 
                    maxWidth: '400px', // 최대 너비 설정 (모바일 화면 대응)
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default FriendRequests;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Box, Typography, List, ListItem, Avatar, Button, Modal } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const FriendRequests = () => {
    const [cookies] = useCookies(['token']);
    const [friendRequests, setFriendRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
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
        } catch (error) {
            console.error('친구 요청 거절 중 오류 발생:', error);
        }
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Button
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)} // 뒤로 가기 기능
                sx={{
                    marginBottom: 2,
                    backgroundColor: '#1976d2', // 원하는 색상으로 변경 가능
                    '&:hover': {
                        backgroundColor: '#1565c0', // 호버 시 색상 변경
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
                    <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 50, height: 50, marginRight: 2 }}>
                            {request.requester.nickname.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{request.requester.nickname}</Typography>
                            <Typography variant="body2">{request.requester.username}</Typography>
                            <Typography variant="body2">
                                장르: {request.requester.preferredGenres.join(', ')}
                            </Typography>
                            <Typography variant="body2">
                                플레이 시간: {request.requester.playTimes.join(', ')}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleAcceptModalOpen(request)}
                            >
                                수락
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleDeclineModalOpen(request)}
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
                        <Button variant="outlined" color="secondary" onClick={handleAcceptModalClose}>
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
        </Box>
    );
};

export default FriendRequests;

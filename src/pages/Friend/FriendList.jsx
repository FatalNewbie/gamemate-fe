import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Box, Typography, List, ListItem, Avatar, IconButton, Modal, Button, Snackbar, Alert, Divider } from '@mui/material';
import { Delete, ArrowBack } from '@mui/icons-material';
import profilePlaceholder from '../../assets/profile_placeholder.png';
import { useNavigate } from 'react-router-dom';

const FriendList = () => {
    const [cookies] = useCookies(['token']);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await axios.get('/friend/', {
                    headers: {
                        Authorization: cookies.token,
                    },
                });
                setFriends(response.data.data);
            } catch (error) {
                console.error('친구 목록을 가져오는 데 실패했습니다:', error);
            }
        };

        fetchFriends();
    }, [cookies.token]);

    const handleDeleteModalOpen = (friend) => {
        setSelectedFriend(friend);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteModalClose = () => {
        setIsDeleteModalOpen(false);
    };

    const handleDeleteFriend = async () => {
        if (!selectedFriend) return;

        try {
            await axios.delete(`/friend/${selectedFriend.id}`, {
                headers: {
                    Authorization: cookies.token,
                },
            });

            setFriends(prevFriends => prevFriends.filter(friend => friend.id !== selectedFriend.id));
            setIsDeleteModalOpen(false);
            setSnackbarMessage('친구 삭제가 완료되었습니다.');
            setIsSnackbarOpen(true);
        } catch (error) {
            console.error('친구를 삭제하는 데 실패했습니다:', error);
            setSnackbarMessage('친구 삭제에 실패했습니다.');
            setIsSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setIsSnackbarOpen(false);
    };

    return (
        <Box>
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
            <Box
                sx={{
                    bgcolor: '#fff',
                    paddingTop: 2,
                    paddingBottom: 0,
                    borderRadius: 1,
                    minHeight: '100px',
                    marginBottom: 2,
                    boxShadow: 3,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        paddingLeft: 2,
                        paddingBottom: 1,
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        fontSize: '14pt',
                        letterSpacing: '-0.5px',
                        borderBottom: '1px solid #e0e0e0'
                    }}
                >
                친구 목록
                </Typography>
                {friends.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '300px',
                        }}
                    >
                        <Typography variant="h6" color="textSecondary">
                            아직 친구로 등록된 유저가 없습니다.
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {friends.map(friend => (
                            <ListItem key={friend.id} sx={{ display: 'block', alignItems: 'center' }}>
                                <Box sx={{display: 'flex'}}>
                                    <Avatar
                                            src={friend.userProfile || profilePlaceholder}  // 프로필 사진이 없을 경우 기본 이미지 사용
                                            alt={friend.nickname}
                                            sx={{ width: 50, height: 50, marginRight: 2 }}
                                        />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontFamily: 'Roboto, sans-serif',
                                                fontWeight: 700,
                                                fontSize: '14pt',
                                                letterSpacing: '-0.5px',
                                            }}
                                        >{friend.nickname}</Typography>
                                        <Typography variant="body2">{friend.username}</Typography>
                                    </Box>
                                    <IconButton
                                        color="secondary"
                                        onClick={() => handleDeleteModalOpen(friend)}
                                        sx={{
                                            backgroundColor: '#f5f5f5',  // 버튼 배경 색상
                                            '&:hover': {
                                                backgroundColor: '#e0e0e0',  // 호버 시 배경 색상
                                            },
                                            borderRadius: '30%',  // 둥근 버튼 모양
                                            marginTop: 'auto',
                                            marginLeft: 'auto',
                                            height: '40px',
                                            padding: '8px',  // 버튼 패딩
                                            color: '#ff1744',  // 아이콘 색상
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                                <Divider sx={{ backgroundColor: 'rgba(128, 128, 128, 0.3)', width: '100%', mb: 2, marginTop: '10px' }} />
                            </ListItem>
                        ))}
                    </List>
                )}

                {/* 삭제 확인 모달 */}
                <Modal
                    open={isDeleteModalOpen}
                    onClose={handleDeleteModalClose}
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
                            variant="h6"
                            sx={{
                                fontFamily: 'Roboto, sans-serif',
                                fontWeight: 600,
                                fontSize: '11pt',
                                letterSpacing: '-0.5px',
                                marginBottom: '20px',
                                marginTop: '10px',
                            }}
                        >
                            {selectedFriend?.nickname}님과의 친구 관계를 삭제하시겠습니까?
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleDeleteFriend}
                                sx={{
                                    backgroundColor: 'rgba(10, 8, 138, 0.8)',
                                    color: '#fff',
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
                                onClick={handleDeleteModalClose}
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

                {/* 친구 삭제 완료 알림 */}
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
        </Box>
    );
};

export default FriendList;

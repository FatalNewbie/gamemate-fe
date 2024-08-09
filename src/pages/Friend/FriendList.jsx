import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Box, Typography, List, ListItem, Avatar, IconButton, Modal, Button } from '@mui/material';
import { Delete } from '@mui/icons-material';

const FriendList = () => {
    const [cookies] = useCookies(['token']);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
        } catch (error) {
            console.error('친구를 삭제하는 데 실패했습니다:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h5">친구 목록</Typography>
            <List>
                {friends.map(friend => (
                    <ListItem key={friend.id} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 50, height: 50, marginRight: 2 }}>
                            {friend.nickname.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{friend.nickname}</Typography>
                            <Typography variant="body2">{friend.username}</Typography>
                        </Box>
                        <IconButton
                            color="secondary"
                            onClick={() => handleDeleteModalOpen(friend)}
                        >
                            <Delete />
                        </IconButton>
                    </ListItem>
                ))}
            </List>

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
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {selectedFriend?.nickname}님과의 친구 관계를 삭제하시겠습니까?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Button variant="contained" color="primary" onClick={handleDeleteFriend}>
                            예
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleDeleteModalClose}>
                            아니오
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default FriendList;

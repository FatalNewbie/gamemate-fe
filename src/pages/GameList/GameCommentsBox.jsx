import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Button, Divider, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LoginRequiredModal from './LoginRequiredModal'; // LoginRequiredModal import
import token from './authToken'; // authToken import

const GameCommentsBox = ({ comments, totalComments, commentPage, loadMoreComments, handleOpenCommentModal }) => {
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // 토큰이 있는지를 확인하여 로그인 상태 설정
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const handleIconClick = () => {
        if (isLoggedIn) {
            handleOpenCommentModal();
        } else {
            setOpenLoginModal(true);
        }
    };

    const handleCloseLoginModal = () => {
        setOpenLoginModal(false);
    };

    return (
        <Box
            sx={{
                marginTop: '24px',
                padding: '16px',
                borderRadius: '10px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    💬 댓글 ({totalComments})
                </Typography>
                <IconButton sx={{ color: '#0A088A' }} onClick={handleIconClick}>
                    <AddIcon />
                </IconButton>
            </Box>
            <Divider sx={{ marginY: '16px' }} />

            {comments.map((comment, index) => (
                <Box key={comment.id} sx={{ marginBottom: '16px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <Avatar
                            alt="avatar"
                            src={`path_to_avatar/${comment.userId}`}
                            sx={{ width: '54px', height: '54px', marginRight: '10px', ml: '8px' }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                    {comment.nickname}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                    {new Date(comment.createdDate).toLocaleDateString()}
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ marginTop: '4px' }}>
                                {comment.content}
                            </Typography>
                        </Box>
                    </Box>

                    {index < comments.length - 1 && <Divider sx={{ marginY: '16px' }} />}
                </Box>
            ))}

            {commentPage * 10 < totalComments && (
                <Button
                    variant="outlined"
                    onClick={loadMoreComments}
                    sx={{
                        marginTop: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                    }}
                >
                    <ExpandMoreIcon />
                </Button>
            )}

            {/* 로그인 필요 모달 */}
            <LoginRequiredModal open={openLoginModal} onClose={handleCloseLoginModal} />
        </Box>
    );
};

export default GameCommentsBox;

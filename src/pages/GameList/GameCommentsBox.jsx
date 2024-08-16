import React, { useState } from 'react';
import { Box, Typography, Avatar, Button, Divider, IconButton, Snackbar, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LoginRequiredModal from './LoginRequiredModal';
import CommentDeleteModal from './CommentDeleteModal';
import CommentUpdateModal from './CommentUpdateModal';
import profilePlaceholder from '../../assets/profile_placeholder.png';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { api } from '../../apis/customAxios';

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Failed to parse JWT:', e);
        return null;
    }
}

const GameCommentsBox = ({
    comments,
    setComments,
    totalComments,
    commentPage,
    loadMoreComments,
    handleOpenCommentModal,
    game,
    onDeleteComment,
}) => {
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [commentToUpdate, setCommentToUpdate] = useState(null);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [cookies] = useCookies(['token']);
    const isLoggedIn = !!cookies.token;
    const tokenPayload = cookies.token ? parseJwt(cookies.token.split(' ')[1]) : null;
    const loggedInUsername = tokenPayload ? tokenPayload.username : '';

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

    const handleEditClick = (comment) => {
        setCommentToUpdate(comment);
        setOpenUpdateModal(true);
    };

    const handleDeleteClick = (comment) => {
        setCommentToDelete(comment);
        setOpenDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        const commentId = commentToDelete.id;
        axios
            .delete(`${process.env.REACT_APP_API_URL}/games/${game.id}/comments/${commentId}`, {
                headers: {
                    Authorization: `${cookies.token}`,
                },
            })
            .then(() => {
                setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
                onDeleteComment(commentId); // 삭제된 댓글 처리 함수 호출
                setOpenDeleteModal(false);
            })
            .catch((error) => {
                console.error('There was an error deleting the comment:', error);
            });
    };
    const handleUpdateConfirm = (updatedComment) => {
        setComments((prevComments) =>
            prevComments.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment))
        );
        setOpenUpdateModal(false);
    };

    //친구 추가하기
    const [open, setOpen] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSnackbarClose = () => {
        setIsSnackbarOpen(false);
    };

    const handleFriendRequest = async (receiverId) => {
        try {
            const response = await api.post(
                '/friend/',
                {
                    receiverId: receiverId,
                },
                {
                    headers: {
                        Authorization: cookies.token,
                    },
                }
            );

            setOpen(false);
            setSnackbarMessage(response.data.message);
            setIsSnackbarOpen(true);
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
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

            {comments.length === 0 ? (
                <Typography variant="body2" sx={{ textAlign: 'center', color: '#999', marginTop: '16px' }}>
                    첫 댓글을 달아보세요!
                </Typography>
            ) : (
                comments.map((comment, index) => (
                    <Box key={comment.id} sx={{ marginBottom: '16px' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                            <Avatar
                                alt="avatar"
                                src={comment.userProfile || profilePlaceholder} // Use userProfile from GameCommentDto
                                sx={{ width: '54px', height: '54px', marginRight: '10px', ml: '8px' }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                            <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                                {comment.nickname}
                                            </Typography>
                                            {comment.username !== loggedInUsername && (
                                                <PersonAddAltIcon
                                                    onClick={() => handleFriendRequest(comment.userId)}
                                                    sx={{ fontSize: 'medium', pl: '7px' }}
                                                />
                                            )}
                                        </Box>
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            {new Date(comment.createdDate).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    {comment.username === loggedInUsername && (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton
                                                sx={{ color: '#0A088A', fontSize: '9px' }}
                                                onClick={() => handleEditClick(comment)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                sx={{ color: '#0A088A', fontSize: '9px' }}
                                                onClick={() => handleDeleteClick(comment)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>
                                <Typography variant="body2" sx={{ marginTop: '4px' }}>
                                    {comment.content}
                                </Typography>
                            </Box>
                        </Box>

                        {index < comments.length - 1 && <Divider sx={{ marginY: '16px' }} />}
                    </Box>
                ))
            )}

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

            <LoginRequiredModal open={openLoginModal} onClose={handleCloseLoginModal} />

            <CommentUpdateModal
                open={openUpdateModal}
                onClose={() => setOpenUpdateModal(false)}
                game={game}
                commentId={commentToUpdate?.id}
                existingComment={commentToUpdate?.content}
                onConfirm={handleUpdateConfirm}
            />

            <CommentDeleteModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
            />
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
                <Alert
                    onClose={handleSnackbarClose}
                    severity="success"
                    sx={{
                        width: '100%',
                        backgroundColor: 'rgba(10, 8, 138, 0.8)', // 배경 색상
                        color: '#ffffff', // 텍스트 색상
                        fontSize: '11px',
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default GameCommentsBox;

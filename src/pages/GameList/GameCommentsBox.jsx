import React, { useState } from 'react';
import { Box, Typography, Avatar, Button, Divider, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LoginRequiredModal from './LoginRequiredModal';
import CommentDeleteModal from './CommentDeleteModal';
import CommentUpdateModal from './CommentUpdateModal';
import profilePlaceholder from '../../assets/profile_placeholder.png';
import { useCookies } from 'react-cookie';
import axios from 'axios';

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

    const sortedComments = [...comments].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

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
            .delete(`http://localhost:8080/games/${game.id}/comments/${commentId}`, {
                headers: {
                    Authorization: `${cookies.token}`,
                },
            })
            .then(() => {
                setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
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

            {sortedComments.length === 0 ? (
                <Typography variant="body2" sx={{ textAlign: 'center', color: '#999', marginTop: '16px' }}>
                    첫 댓글을 달아보세요!
                </Typography>
            ) : (
                sortedComments.map((comment, index) => (
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
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>
                                            {comment.nickname}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            {new Date(comment.createdDate).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    {comment.username === loggedInUsername && (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton
                                                sx={{ color: '#0A088A', fontSize: '18px' }}
                                                onClick={() => handleEditClick(comment)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                sx={{ color: '#0A088A', fontSize: '18px' }}
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

                        {index < sortedComments.length - 1 && <Divider sx={{ marginY: '16px' }} />}
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
        </Box>
    );
};

export default GameCommentsBox;

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Chip,
    Button,
    IconButton,
    TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
};

const cleanDeveloperName = (name, maxLength = 20) => {
    if (!name) return '';
    let cleanedName = name.replace(/^(주식회사 |\(주\))/g, '');
    cleanedName = cleanedName.replace(/( 주식회사| Inc\.?| \(유\)| \(주\)|\(주\))$/g, '');
    return truncateText(cleanedName, maxLength);
};

const cleanGenre = (genre, maxLength = 20) => {
    if (!genre) return '';
    return truncateText(genre.replace(/\(베팅성\)$/, ''), maxLength);
};

const CommentUpdateModal = ({ open, onClose, game, commentId, existingComment, onConfirm }) => {
    const [comment, setComment] = useState('');
    const [cookies] = useCookies(['token']);

    useEffect(() => {
        if (open) {
            setComment(existingComment);
        }
    }, [open, existingComment]);

    const handleConfirm = () => {
        const commentData = {
            content: comment,
        };

        axios
            .put(`${process.env.REACT_APP_API_URL}/games/${game.id}/comments/${commentId}`, commentData, {
                headers: {
                    Authorization: `${cookies.token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                console.log('Comment updated successfully:', response.data);
                onConfirm(response.data.data);
                onClose();
            })
            .catch((error) => {
                console.error('There was an error updating the comment:', error);
            });
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ style: { padding: '20px', borderRadius: '10px' } }}>
            <DialogTitle sx={{ padding: '8px 16px', fontSize: '1rem', fontWeight: 'bold' }}>
                ✏️ 댓글 수정
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: '8px', top: '8px' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', padding: '8px 16px' }}>
                <Typography variant="h6" sx={{ marginTop: '20px', marginBottom: '10px', fontSize: '1rem' }}>
                    {truncateText(game.title, 30)}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <Chip
                        label={truncateText(game.platform, 20) || 'Unknown Platform'}
                        sx={{
                            backgroundColor: '#0A088A',
                            color: '#fff',
                            marginRight: '8px',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            height: '24px',
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    />
                    <Chip
                        label={cleanGenre(game.genre, 20) || 'Unknown Genre'}
                        sx={{
                            backgroundColor: '#5D5AE0',
                            color: '#fff',
                            marginRight: '8px',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            height: '24px',
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    />
                    <Chip
                        label={cleanDeveloperName(game.developer, 20) || 'Unknown Developer'}
                        sx={{
                            backgroundColor: '#8F8EC9',
                            color: '#fff',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            height: '24px',
                            maxWidth: '150px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    />
                </Box>
                <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="댓글을 수정하세요..."
                    fullWidth
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ marginBottom: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}
                />
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#0A088A',
                        color: '#fff',
                        borderRadius: '30px',
                        fontWeight: 'bold',
                        padding: '8px 30px',
                        '&:hover': {
                            backgroundColor: '#8F8EC9',
                        },
                    }}
                    onClick={handleConfirm}
                >
                    확인
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default CommentUpdateModal;

import React, { useState } from 'react';
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

const CommentModal = ({ open, onClose, game, onConfirm }) => {
    const [comment, setComment] = useState('');
    const [cookies] = useCookies(['token']); // useCookies 사용

    const handleConfirm = () => {
        const commentData = {
            content: comment, // 작성된 댓글 내용
        };

        axios
            .post(`http://localhost:8080/games/${game.id}/comments`, commentData, {
                headers: {
                    Authorization: `${cookies.token}`, // 토큰을 헤더에 포함
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                console.log('Comment saved successfully:', response.data);
                onConfirm(response.data.data); // 새로운 댓글 데이터를 전달
                setComment(''); // 상태 초기화
                onClose(); // 모달 닫기
            })
            .catch((error) => {
                console.error('There was an error saving the comment:', error);
            });
    };

    const cleanDeveloperName = (name) => {
        if (!name) return '';
        let cleanedName = name.replace(/^(주식회사 |\(주\))/g, '');
        cleanedName = cleanedName.replace(/( 주식회사| Inc\.?| \(유\)| \(주\)|\(주\))$/g, '');
        return cleanedName;
    };

    const cleanGenre = (genre) => {
        if (!genre) return '';
        return genre.replace(/\(베팅성\)$/, '');
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ style: { padding: '20px', borderRadius: '10px' } }}>
            <DialogTitle sx={{ padding: '8px 16px', fontSize: '1rem', fontWeight: 'bold' }}>
                💬 댓글 추가
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: '8px', top: '8px' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', padding: '8px 16px' }}>
                <Typography variant="h6" sx={{ marginTop: '20px', marginBottom: '10px', fontSize: '1rem' }}>
                    {game.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <Chip
                        label={game.platform || 'Unknown Platform'}
                        sx={{
                            backgroundColor: '#0A088A',
                            color: '#fff',
                            marginRight: '8px',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            height: '24px',
                        }}
                    />
                    <Chip
                        label={cleanGenre(game.genre) || 'Unknown Genre'}
                        sx={{
                            backgroundColor: '#5D5AE0',
                            color: '#fff',
                            marginRight: '8px',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            height: '24px',
                        }}
                    />
                    <Chip
                        label={cleanDeveloperName(game.developer) || 'Unknown Developer'}
                        sx={{
                            backgroundColor: '#8F8EC9',
                            color: '#fff',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            height: '24px',
                        }}
                    />
                </Box>
                <TextField
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="댓글을 입력하세요..."
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

export default CommentModal;

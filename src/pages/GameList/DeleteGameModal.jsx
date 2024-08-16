import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const DeleteGameModal = ({ open, onClose, gameId, onGameDeleted }) => {
    const [cookies] = useCookies(['token']);

    const handleDeleteGame = () => {
        axios
            .delete(`http://localhost:8080/games/my-games/${gameId}`, {
                headers: {
                    Authorization: `${cookies.token}`,
                },
            })
            .then((response) => {
                console.log('Game deleted successfully:', response.data);
                onGameDeleted(); // Update parent component state
                onClose(); // Close the modal after deleting the game
            })
            .catch((error) => {
                console.error('There was an error deleting the game:', error);
            });
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ style: { padding: '20px', borderRadius: '10px' } }}>
            <DialogTitle sx={{ padding: '8px 16px', fontSize: '1rem', fontWeight: 'bold' }}>
                🎮 게임 추가
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: '8px', top: '8px' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', padding: '8px 16px', maxWidth: '400px' }}>
                <Typography variant="body1" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                    이미 추가되어 있는 게임입니다!
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#0A088A',
                        color: '#fff',
                        borderRadius: '30px',
                        fontWeight: 'bold',
                        padding: '8px 30px',
                        marginRight: '10px',
                        '&:hover': {
                            backgroundColor: '#8F8EC9',
                        },
                    }}
                    onClick={onClose}
                >
                    확인
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#DB5024',
                        color: '#fff',
                        borderRadius: '30px',
                        fontWeight: 'bold',
                        padding: '8px 30px',
                        '&:hover': {
                            backgroundColor: '#FF6347',
                        },
                    }}
                    onClick={handleDeleteGame}
                >
                    삭제
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteGameModal;

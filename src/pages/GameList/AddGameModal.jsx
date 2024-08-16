import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const AddGameModal = ({ open, onClose, gameId, onGameAdded }) => {
    const [cookies] = useCookies(['token']);

    const handleAddGame = () => {
        axios
            .post(
                `${process.env.REACT_APP_API_URL}/games/my-games/${gameId}`,
                {},
                {
                    headers: {
                        Authorization: `${cookies.token}`,
                    },
                }
            )
            .then((response) => {
                console.log('Game added successfully:', response.data);
                onGameAdded(); // Update parent component state
                onClose(); // Close the modal after adding the game
            })
            .catch((error) => {
                console.error('There was an error adding the game:', error);
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
                    선호 게임에 추가하시겠습니까?
                </Typography>
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
                    onClick={handleAddGame}
                >
                    확인
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default AddGameModal;

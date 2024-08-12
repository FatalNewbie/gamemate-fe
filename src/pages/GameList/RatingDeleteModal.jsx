import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const RatingDeleteModal = ({ open, onClose, gameId, onDelete }) => {
    const [cookies] = useCookies(['token']);

    const handleConfirm = () => {
        console.log(`Deleting rating for gameId: ${gameId} with token: ${cookies.token}`);
        axios
            .delete(`http://localhost:8080/games/${gameId}/ratings`, {
                headers: {
                    Authorization: `${cookies.token}`,
                },
            })
            .then((response) => {
                console.log('Rating deleted successfully:', response.data);
                onDelete(); // Call the onDelete function to update the state in parent component
                onClose(); // Close the modal after deletion
            })
            .catch((error) => {
                console.error('There was an error deleting the rating:', error);
            });
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ style: { padding: '20px', borderRadius: '10px' } }}>
            <DialogTitle sx={{ padding: '8px 16px', fontSize: '1rem', fontWeight: 'bold' }}>
                ⭐ 평점 삭제
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: '8px', top: '8px' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', padding: '8px 16px', maxWidth: '400px' }}>
                <Typography variant="body1" sx={{ marginTop: '20px', marginBottom: '20px' }}>
                    삭제하시겠습니까?
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
                    onClick={handleConfirm}
                >
                    확인
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default RatingDeleteModal;

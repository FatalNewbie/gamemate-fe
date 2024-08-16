import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Button, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const RatingDeleteModal = ({ open, onClose, gameId, onDelete }) => {
    const [cookies] = useCookies(['token']);

    const handleConfirm = () => {
        axios
            .delete(`http://localhost:8080/games/${gameId}/ratings`, {
                headers: {
                    Authorization: `${cookies.token}`,
                },
            })
            .then((response) => {
                onDelete(); // Call the onDelete function to update the state in parent component
                onClose(); // Close the modal after deletion
            })
            .catch((error) => {
                console.error('There was an error deleting the rating:', error);
            });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    padding: '10px',
                    borderRadius: '10px',
                    minWidth: '300px', // 가로폭 최소 300px
                },
            }}
        >
            <DialogTitle
                sx={{
                    padding: '8px 16px', // 좌우 여백 조정
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography sx={{ fontSize: '1rem', fontWeight: 'bold', marginRight: 'auto' }}>⭐ 평점 삭제</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', padding: '8px 24px' }}>
                <Typography sx={{ margin: '24px 0 32px', fontSize: '0.875rem' }}>삭제하시겠습니까?</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#0A088A',
                            color: '#fff',
                            borderRadius: '30px',
                            fontWeight: 'bold',
                            padding: '8px 30px',
                        }}
                        onClick={handleConfirm}
                    >
                        확인
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default RatingDeleteModal;

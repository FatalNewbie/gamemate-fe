import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Chip, Button, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import token from './authToken'; // Import the token

const RatingModal = ({ open, onClose, game, onConfirm, userId }) => {
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseMove = (index, event) => {
        const { left, width } = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - left;
        const newRating = index + (x / width >= 0.5 ? 1 : 0.5);
        setHoverRating(newRating);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleRating = (rating) => {
        setSelectedRating(rating);
    };

    const handleConfirm = () => {
        const ratingData = {
            userId: userId, // Set the actual userId here
            rating: selectedRating * 2, // Convert to a 10-point scale
        };

        axios
            .post(`http://localhost:8080/games/${game.id}/ratings`, ratingData, {
                headers: {
                    Authorization: `${token}`, // Use the token here
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                console.log('Rating saved successfully:', response.data);
                onConfirm(selectedRating);
                onClose();
            })
            .catch((error) => {
                console.error('There was an error saving the rating:', error);
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
                ⭐ 평점 추가
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
                <Box
                    sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}
                    onMouseLeave={handleMouseLeave}
                >
                    {[...Array(5)].map((_, index) => (
                        <Box
                            key={index}
                            sx={{ display: 'inline-block', cursor: 'pointer' }}
                            onMouseMove={(event) => handleMouseMove(index, event)}
                            onClick={() => handleRating(hoverRating)}
                        >
                            <StarIcon
                                sx={{
                                    fontSize: '52px',
                                    color: (hoverRating || selectedRating) > index ? '#F1C644' : '#D4D4D4',
                                }}
                            />
                        </Box>
                    ))}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
                    {selectedRating.toFixed(1)}
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

export default RatingModal;

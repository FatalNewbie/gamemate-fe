import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import LoginRequiredModal from './LoginRequiredModal';
import token from './authToken'; // 토큰 가져오기

const GameRatingBox = ({ averageRating, totalRaters, userRating, handleOpenRatingModal }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);

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
            handleOpenRatingModal();
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
                backgroundColor: '#f9f9f9',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    ⭐ 평점
                </Typography>
                <IconButton sx={{ color: '#0A088A' }} onClick={handleIconClick}>
                    <AddIcon />
                </IconButton>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 'bold', marginTop: '8px' }}>
                {averageRating}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
                ({totalRaters}명)
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                {[...Array(5)].map((_, index) => (
                    <StarIcon
                        key={index}
                        sx={{
                            fontSize: '32px',
                            color: index < Math.round(averageRating) ? '#F1C644' : '#D4D4D4',
                        }}
                    />
                ))}
            </Box>

            <Divider sx={{ marginY: '16px' }} />

            {isLoggedIn && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '10px',
                    }}
                >
                    <Typography variant="body2" sx={{ marginRight: '8px' }}>
                        내 평점:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', marginRight: '8px' }}>
                        {userRating ? (userRating / 2).toFixed(1) : 'N/A'}
                    </Typography>
                    <Box sx={{ display: 'flex' }}>
                        {[...Array(5)].map((_, index) => (
                            <StarIcon
                                key={index}
                                sx={{
                                    fontSize: '20px',
                                    color: index < userRating / 2 ? '#F1C644' : '#D4D4D4',
                                }}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* 로그인 필요 모달 */}
            <LoginRequiredModal open={openLoginModal} onClose={handleCloseLoginModal} />
        </Box>
    );
};

export default GameRatingBox;

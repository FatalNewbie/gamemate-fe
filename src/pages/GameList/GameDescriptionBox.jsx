import React from 'react';
import { Box, Typography, Chip, Divider } from '@mui/material'; // 필요한 모듈 가져오기
import StarIcon from '@mui/icons-material/Star'; // StarIcon 가져오기

const GameDescriptionBox = ({ game, chipStyle, cleanDeveloperName, cleanGenre }) => {
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ marginTop: '4px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem', textAlign: 'left' }}>
                            {game.title}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'left', marginTop: '8px' }}>
                            {[...Array(5)].map((_, index) => (
                                <StarIcon
                                    key={index}
                                    sx={{
                                        fontSize: '24px',
                                        color:
                                            index <
                                            Math.round(
                                                (game.ratings || []).reduce((sum, rating) => sum + rating.rating, 0) /
                                                    game.ratings.length /
                                                    2
                                            )
                                                ? '#F1C644'
                                                : '#e0e0e0',
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Divider orientation="vertical" flexItem sx={{ marginX: '16px' }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                marginBottom: '8px',
                            }}
                        >
                            <Typography variant="body2" sx={{ fontSize: '0.65rem', marginRight: '8px' }}>
                                개발사
                            </Typography>
                            <Chip
                                label={cleanDeveloperName(game.developer)}
                                sx={{ ...chipStyle, backgroundColor: '#8F8EC9' }}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                marginBottom: '8px',
                            }}
                        >
                            <Typography variant="body2" sx={{ fontSize: '0.65rem', marginRight: '8px' }}>
                                장르
                            </Typography>
                            <Chip label={cleanGenre(game.genre)} sx={{ ...chipStyle, backgroundColor: '#5D5AE0' }} />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                marginBottom: '8px',
                            }}
                        >
                            <Typography variant="body2" sx={{ fontSize: '0.65rem', marginRight: '8px' }}>
                                플랫폼
                            </Typography>
                            <Chip label={game.platform} sx={{ ...chipStyle, backgroundColor: '#0A088A' }} />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Typography variant="body2" sx={{ fontSize: '0.65rem', marginRight: '8px' }}>
                                등급
                            </Typography>
                            <Chip label={game.classes} sx={{ ...chipStyle, backgroundColor: '#8F8EC9' }} />
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Divider sx={{ marginBottom: '16px', marginTop: '16px' }} />

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    fontSize: '0.65rem',
                    marginBottom: '16px',
                    paddingX: '24px',
                    paddingY: '10px',
                }}
            >
                <Typography variant="body2" sx={{ fontSize: '0.65rem', marginRight: '8px' }}>
                    요약:
                </Typography>
                <Box sx={{ flex: 1, fontSize: '0.65rem' }}>{game.description}</Box>
            </Box>
            <Divider sx={{ marginBottom: '16px', marginTop: '16px' }} />
        </>
    );
};

export default GameDescriptionBox;

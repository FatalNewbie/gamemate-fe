import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Chip, Button, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
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
    let cleanedName = name.replace(/^(주식회사 |\(주\))/g, '');
    cleanedName = cleanedName.replace(/( 주식회사| Inc\.?| \(유\)| \(주\)|\(주\))$/g, '');
    return truncateText(cleanedName, maxLength);
};

const cleanGenre = (genre, maxLength = 20) => {
    let cleanedGenre = genre.replace(/\(베팅성\)$/, '');
    return truncateText(cleanedGenre, maxLength);
};

const RatingModal = ({ open, onClose, game, onUpdate, userId }) => {
    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [cookies] = useCookies(['token']);

    const handleMouseMove = (index, event) => {
        const { left, width } = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - left;
        const newRating = index + (x / width >= 0.5 ? 1 : 0.5);
        setHoverRating(newRating);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleRating = (index, event) => {
        const { left, width } = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - left;
        const newRating = index + (x / width >= 0.5 ? 1 : 0.5);
        setSelectedRating(newRating);
    };

    const handleConfirm = () => {
        const ratingData = {
            userId: userId,
            rating: selectedRating * 2, // 0.5점 단위로 설정했으므로 실제로 저장할 때는 2배로 저장
        };

        axios
            .post(`${process.env.REACT_APP_API_URL}/games/${game.id}/ratings`, ratingData, {
                headers: {
                    Authorization: `${cookies.token}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((response) => {
                console.log('Rating saved successfully:', response.data);
                onUpdate(selectedRating * 2);
                onClose();
            })
            .catch((error) => {
                console.error('There was an error saving the rating:', error);
            });
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
                <Typography
                    variant="h6"
                    sx={{
                        marginTop: '20px',
                        marginBottom: '10px',
                        fontSize: '1rem',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
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
                <Box
                    sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}
                    onMouseLeave={handleMouseLeave}
                >
                    {[...Array(5)].map((_, index) => (
                        <Box
                            key={index}
                            sx={{ display: 'inline-block', cursor: 'pointer', position: 'relative' }}
                            onMouseMove={(event) => handleMouseMove(index, event)}
                            onClick={(event) => handleRating(index, event)}
                        >
                            {/* 빈 별 */}
                            <StarIcon
                                sx={{
                                    fontSize: '52px',
                                    color: '#D4D4D4',
                                }}
                            />
                            {/* 반 별 (왼쪽) */}
                            {hoverRating >= index + 0.5 && hoverRating < index + 1 && selectedRating < index + 0.5 && (
                                <StarIcon
                                    sx={{
                                        fontSize: '52px',
                                        color: '#F1C644',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        clipPath: 'inset(0 50% 0 0)', // 오른쪽 절반을 잘라냄
                                    }}
                                />
                            )}
                            {/* 반 별 (왼쪽) - 마우스 오버 또는 클릭 시 반 별로 채워짐 */}
                            {selectedRating >= index + 0.5 && selectedRating < index + 1 && (
                                <StarIcon
                                    sx={{
                                        fontSize: '52px',
                                        color: '#F1C644',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        clipPath: 'inset(0 50% 0 0)', // 오른쪽 절반을 잘라냄
                                    }}
                                />
                            )}
                            {/* 전체 별 - 마우스 오버 또는 클릭 시 전체 별로 채워짐 */}
                            {hoverRating >= index + 1 || selectedRating >= index + 1 ? (
                                <StarIcon
                                    sx={{
                                        fontSize: '52px',
                                        color: '#F1C644',
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                    }}
                                />
                            ) : null}
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

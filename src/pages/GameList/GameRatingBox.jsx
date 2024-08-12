import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LoginRequiredModal from './LoginRequiredModal';
import RatingModal from './RatingModal';
import RatingUpdateModal from './RatingUpdateModal';
import RatingDeleteModal from './RatingDeleteModal';
import { useCookies } from 'react-cookie';
import axios from 'axios';

const GameRatingBox = ({ averageRating, totalRaters, userRating, setUserRating, gameId, game, onRatingUpdate }) => {
    const [cookies] = useCookies(['token']);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [openRatingModal, setOpenRatingModal] = useState(false);
    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    useEffect(() => {
        const fetchUserRating = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/games/${gameId}/ratings`, {
                    headers: {
                        Authorization: cookies.token,
                    },
                });

                if (response.data && response.data.data && response.data.data.rating !== undefined) {
                    setUserRating(response.data.data.rating);
                } else {
                    setUserRating(null); // 평점이 없으면 기본값을 null로 설정
                }
            } catch (error) {
                console.error('Error fetching user rating:', error);
                setUserRating(null); // 에러 발생 시에도 기본값을 null로 설정
            }
        };

        if (cookies.token) {
            setIsLoggedIn(true);
            fetchUserRating();
        }
    }, [cookies.token, gameId, setUserRating]);

    const handleIconClick = () => {
        if (isLoggedIn) {
            if (userRating === null || userRating === 0) {
                setOpenRatingModal(true);
            } else {
                setOpenUpdateModal(true);
            }
        } else {
            setOpenLoginModal(true);
        }
    };

    const handleCloseLoginModal = () => {
        setOpenLoginModal(false);
    };

    const handleCloseRatingModal = () => {
        setOpenRatingModal(false);
    };

    const handleCloseUpdateModal = () => {
        setOpenUpdateModal(false);
    };

    const handleUpdateRating = (newRating) => {
        // 유저의 기존 평점이 있는지 확인
        const hasExistingRating = userRating !== null && userRating !== 0;

        // 새로운 평점을 적용한 평점 리스트 계산
        const updatedRatings = hasExistingRating
            ? game.ratings.map((rating) =>
                  rating.userId === cookies.userId ? { ...rating, rating: newRating } : rating
              )
            : [...game.ratings, { userId: cookies.userId, rating: newRating }];

        // 인원수 및 평균 평점 업데이트
        const newTotalRaters = updatedRatings.length;
        const newAverageRating = updatedRatings.reduce((sum, rating) => sum + rating.rating, 0) / newTotalRaters;

        setUserRating(newRating);
        onRatingUpdate(newRating, newTotalRaters, newAverageRating);
        handleCloseUpdateModal();
        handleCloseRatingModal();
    };

    const handleDeleteRating = () => {
        // 기존 평점 리스트에서 현재 사용자의 평점을 제외한 새로운 리스트 생성
        const updatedRatings = game.ratings.filter((rating) => rating.userId !== cookies.userId);

        // 인원수 및 평균 평점 업데이트
        const newTotalRaters = updatedRatings.length;
        const newAverageRating =
            newTotalRaters > 0 ? updatedRatings.reduce((sum, rating) => sum + rating.rating, 0) / newTotalRaters : 0;

        setUserRating(null); // 삭제 후 평점을 null로 설정
        onRatingUpdate(null, newTotalRaters, newAverageRating); // 평점 삭제 후 상태 업데이트
        handleCloseDeleteModal(); // 삭제 모달 닫기
    };

    const handleOpenDeleteModal = () => {
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
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
                {(!isLoggedIn || userRating === null || userRating === 0) && (
                    <IconButton sx={{ color: '#0A088A' }} onClick={handleIconClick}>
                        <AddIcon />
                    </IconButton>
                )}
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

            {isLoggedIn && userRating !== null && userRating !== 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '10px',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ marginRight: '8px' }}>
                            내 평점:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', marginRight: '8px' }}>
                            {(userRating / 2).toFixed(1)}
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
                    <Box sx={{ display: 'flex' }}>
                        <IconButton sx={{ color: '#0A088A' }} onClick={handleIconClick}>
                            <EditIcon />
                        </IconButton>
                        <IconButton sx={{ color: '#0A088A' }} onClick={handleOpenDeleteModal}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            )}

            {/* 로그인 필요 모달 */}
            <LoginRequiredModal open={openLoginModal} onClose={handleCloseLoginModal} />

            {/* 평점 모달 */}
            <RatingModal
                open={openRatingModal}
                onClose={handleCloseRatingModal}
                game={game}
                onUpdate={handleUpdateRating}
            />

            {/* 평점 수정 모달 */}
            <RatingUpdateModal
                open={openUpdateModal}
                onClose={handleCloseUpdateModal}
                game={game}
                currentRating={userRating}
                onUpdate={handleUpdateRating}
            />

            {/* 평점 삭제 모달 */}
            <RatingDeleteModal
                open={openDeleteModal}
                onClose={handleCloseDeleteModal}
                gameId={gameId}
                onDelete={handleDeleteRating}
            />
        </Box>
    );
};

export default GameRatingBox;

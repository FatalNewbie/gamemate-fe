import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import GameDescriptionBox from './GameDescriptionBox';
import GameRatingBox from './GameRatingBox';
import GameCommentsBox from './GameCommentsBox';
import RatingModal from './RatingModal';
import CommentModal from './CommentModal';
import { useCookies } from 'react-cookie';

const GameDetails = () => {
    const { id } = useParams();
    const [cookies] = useCookies(['token']);
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRating, setUserRating] = useState(null);
    const [openRatingModal, setOpenRatingModal] = useState(false);
    const [openCommentModal, setOpenCommentModal] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentPage, setCommentPage] = useState(1);
    const [totalComments, setTotalComments] = useState(0);

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/games/${id}`, {
                    headers: {
                        Authorization: `${cookies.token}`,
                    },
                });
                if (response.data && response.data.data) {
                    setGame(response.data.data);
                } else {
                    throw new Error('Game data not found');
                }
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        fetchGameDetails();
    }, [id, cookies.token]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/games/${id}/comments`, {
                    params: { page: commentPage - 1, size: 10, sortBy: 'createdDate', sortDir: 'desc' },
                });
                const fetchedComments = response.data.data.content || [];

                if (commentPage === 1) {
                    setComments(fetchedComments);
                } else {
                    // 기존 댓글에 최신 댓글을 병합 후 정렬
                    setComments((prevComments) => [...prevComments, ...fetchedComments]);
                }

                setTotalComments(response.data.data.totalElements);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComments();
    }, [id, commentPage]);

    const handleOpenRatingModal = () => setOpenRatingModal(true);
    const handleCloseRatingModal = () => setOpenRatingModal(false);

    const handleOpenCommentModal = () => setOpenCommentModal(true);
    const handleCloseCommentModal = () => setOpenCommentModal(false);

    const handleCommentSubmitted = (newComment) => {
        // 새로운 댓글을 가장 앞에 추가하고 총 댓글 수를 증가시킵니다.
        setComments((prevComments) => [newComment, ...prevComments]);
        setTotalComments((prevTotal) => prevTotal + 1);
    };

    const handleCommentDeleted = (deletedCommentId) => {
        // 댓글이 삭제되면 해당 댓글을 제외한 새로운 댓글 배열로 업데이트하고, 총 댓글 수를 감소시킵니다.
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== deletedCommentId));
        setTotalComments((prevTotal) => prevTotal - 1);
    };

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

    const chipStyle = {
        backgroundColor: '#8F8EC9',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '0.65rem',
        height: '24px',
        padding: '2px 2px',
        borderRadius: '16px',
    };

    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        return (total / ratings.length / 2).toFixed(1);
    };

    const handleUpdateRating = (newRating, newTotalRaters, newAverageRating) => {
        if (game && game.ratings) {
            const updatedRatings = [...game.ratings];
            const existingRatingIndex = updatedRatings.findIndex((rating) => rating.userId === cookies.userId);

            if (existingRatingIndex !== -1) {
                updatedRatings[existingRatingIndex].rating = newRating;
            } else {
                updatedRatings.push({ userId: cookies.userId, rating: newRating });
            }

            setGame((prevGame) => ({
                ...prevGame,
                ratings: updatedRatings,
                totalRaters: newTotalRaters, // 평가 인원수 업데이트
                averageRating: newAverageRating, // 평균 평점 업데이트
            }));
        }
    };

    const totalRaters = game && game.ratings ? game.ratings.length : 0;
    const averageRating = game && game.ratings ? calculateAverageRating(game.ratings) : 0;

    const loadMoreComments = () => {
        setCommentPage((prevPage) => prevPage + 1);
    };

    if (loading) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    if (error) {
        return (
            <Typography variant="h6" color="error">
                Error: {error.message}
            </Typography>
        );
    }

    if (!game) {
        return <Typography variant="h6">게임 정보가 없습니다.</Typography>;
    }

    return (
        <Box
            sx={{
                padding: '24px',
                maxWidth: '800px',
                margin: '0 auto',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
        >
            <GameDescriptionBox
                game={game}
                chipStyle={chipStyle}
                cleanDeveloperName={cleanDeveloperName}
                cleanGenre={cleanGenre}
            />
            <GameRatingBox
                averageRating={averageRating}
                totalRaters={totalRaters}
                userRating={userRating}
                setUserRating={setUserRating}
                handleOpenRatingModal={handleOpenRatingModal}
                gameId={id}
                game={game} // 여기서 game 객체를 전달합니다
                onRatingUpdate={handleUpdateRating} // 추가된 함수
            />
            <GameCommentsBox
                comments={comments}
                setComments={setComments} // setComments 전달
                totalComments={totalComments}
                commentPage={commentPage}
                loadMoreComments={loadMoreComments}
                handleOpenCommentModal={handleOpenCommentModal}
                game={game} // game 전달
                onDeleteComment={handleCommentDeleted}
            />
            {/* Rating Modal */}
            <RatingModal
                open={openRatingModal}
                onClose={handleCloseRatingModal}
                game={game}
                onConfirm={(rating) => {
                    console.log(`Rating submitted: ${rating}`);
                }}
            />

            {/* Comment Modal */}
            <CommentModal
                open={openCommentModal}
                onClose={handleCloseCommentModal}
                game={game}
                onConfirm={(comment) => {
                    console.log(`Comment submitted: ${comment}`);
                    handleCommentSubmitted(comment); // Update the comments list with the new comment
                }}
            />
        </Box>
    );
};

export default GameDetails;

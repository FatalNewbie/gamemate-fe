import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material'; // Typography 가져오기
import axios from 'axios';
import GameDescriptionBox from './GameDescriptionBox';
import GameRatingBox from './GameRatingBox';
import GameCommentsBox from './GameCommentsBox';
import RatingModal from './RatingModal';
import CommentModal from './CommentModal';
import token from './authToken'; // Import the token

const GameDetails = () => {
    const { id } = useParams();
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
                        Authorization: `${token}`, // Use the token here
                    },
                });
                setGame(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };
        fetchGameDetails();
    }, [id]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/games/${id}/comments`, {
                    params: { page: commentPage - 1, size: 10 },
                });
                const fetchedComments = response.data.content || [];

                if (commentPage === 1) {
                    setComments(fetchedComments);
                } else {
                    setComments((prevComments) => [...prevComments, ...fetchedComments]);
                }

                setTotalComments(response.data.totalElements);
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

    const handleAddToGameList = (event) => {
        event.target.style.backgroundColor = '#8F8EC9';
    };

    const cleanDeveloperName = (name) => {
        let cleanedName = name.replace(/^(주식회사 |\(주\))/g, '');
        cleanedName = cleanedName.replace(/( 주식회사| Inc\.?| \(유\)| \(주\)|\(주\))$/g, '');
        return cleanedName;
    };

    const cleanGenre = (genre) => {
        return genre.replace(/\(베팅성\)$/, '');
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

    const totalRaters = game ? game.ratings.length : 0;
    const averageRating = game ? calculateAverageRating(game.ratings) : 0;

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
                handleOpenRatingModal={handleOpenRatingModal}
            />
            <GameCommentsBox
                comments={comments}
                totalComments={totalComments}
                commentPage={commentPage}
                loadMoreComments={loadMoreComments}
                handleOpenCommentModal={handleOpenCommentModal}
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
                }}
            />
        </Box>
    );
};

export default GameDetails;

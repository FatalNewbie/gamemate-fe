import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CommentIcon from '@mui/icons-material/Comment';

const GameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    useEffect(() => {
        const fetchGames = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:8080/games', {
                    headers: {
                        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imhhbmh3aUBlbGljZS5jb20iLCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzIzMDI4MTY5LCJleHAiOjE3MjMwNjQxNjl9.oa8e1eAJ7L3aN8B3mJ-sxx4MolCdUgivPePHxX8j2H0`,
                    },
                    params: { page, size: 10 },
                });
                setGames((prevGames) => [...prevGames, ...response.data.content]);
                setHasMore(!response.data.last);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchGames();
    }, [page]);

    const lastGameElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prevPage) => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        return (total / ratings.length / 2).toFixed(1); // 5점 만점으로 변환
    };

    if (loading && games.length === 0) {
        return <Typography variant="h6">Loading...</Typography>;
    }

    if (error) {
        return (
            <Typography variant="h6" color="error">
                Error: {error.message}
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                padding: '16px 20px',
                maxWidth: '100%',
                margin: '0 auto',
            }}
        >
            <List>
                {games.map((game, index) => (
                    <ListItem
                        ref={games.length === index + 1 ? lastGameElementRef : null}
                        key={`list-item-${index}`}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            padding: 2,
                            marginBottom: 4,
                            borderBottom: '1px solid #e0e0e0',
                            wordWrap: 'break-word',
                            width: '100%',
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    flexGrow: 1,
                                    fontWeight: 'bold',
                                    display: '-webkit-box',
                                    WebkitBoxOrient: 'vertical',
                                    WebkitLineClamp: 2,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontSize: '0.8rem',
                                }}
                            >
                                {game.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CommentIcon fontSize="small" sx={{ marginRight: 0.5 }} />
                                <Typography variant="body2" sx={{ marginRight: 2, fontSize: '0.75rem' }}>
                                    {game.comments ? game.comments.length : 0}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {[...Array(5)].map((_, index) => (
                                        <StarIcon
                                            key={index}
                                            sx={{ fontSize: '14px' }}
                                            color={
                                                index < Math.round(calculateAverageRating(game.ratings))
                                                    ? 'primary'
                                                    : 'disabled'
                                            }
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, marginTop: 2, marginBottom: 2 }}>
                            <Chip
                                label={game.platform}
                                sx={{
                                    backgroundColor: '#0A088A',
                                    color: '#fff',
                                    fontSize: '0.65rem',
                                    fontWeight: 'bold',
                                    height: '22px',
                                }}
                            />
                            <Chip
                                label={game.genre}
                                sx={{
                                    backgroundColor: '#5D5AE0',
                                    color: '#fff',
                                    fontSize: '0.65rem',
                                    fontWeight: 'bold',
                                    maxWidth: '90px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    height: '22px',
                                }}
                            />
                            <Chip
                                label={game.developer}
                                sx={{
                                    backgroundColor: '#8F8EC9',
                                    color: '#fff',
                                    fontSize: '0.65rem',
                                    fontWeight: 'bold',
                                    maxWidth: '100px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    height: '22px',
                                }}
                            />
                        </Box>
                    </ListItem>
                ))}
            </List>
            {loading && <Typography variant="h6">Loading...</Typography>}
        </Box>
    );
};

export default GameList;

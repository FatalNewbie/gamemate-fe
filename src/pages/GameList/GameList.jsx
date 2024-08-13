import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, Chip, Button, Select, MenuItem } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CommentIcon from '@mui/icons-material/Comment';
import { useNavigate } from 'react-router-dom';

const GameList = () => {
    const [allGames, setAllGames] = useState([]);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPlatform, setSelectedPlatform] = useState('All');
    const [sortOrder, setSortOrder] = useState('별점순');
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [hasMore, setHasMore] = useState(true);

    const navigate = useNavigate();
    const observer = useRef();
    const lastGameElementRef = useRef();

    useEffect(() => {
        fetchGames();
    }, [page]);

    const fetchGames = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8080/games', {
                params: { page, size },
            });

            const newGames = response.data.data.content;

            // Fetch totalComments for each game
            const gamesWithComments = await Promise.all(
                newGames.map(async (game) => {
                    const commentsResponse = await axios.get(`http://localhost:8080/games/${game.id}/comments`, {
                        params: { page: 0, size: 1 }, // Only fetching to get total count
                    });
                    return {
                        ...game,
                        totalComments: commentsResponse.data.data.totalElements,
                    };
                })
            );

            setAllGames((prevGames) => {
                const uniqueGames = [...prevGames, ...gamesWithComments].filter(
                    (game, index, self) => index === self.findIndex((g) => g.id === game.id)
                );
                const filteredAndSortedGames = sortAndFilterGames(uniqueGames, selectedPlatform, sortOrder);
                setGames(filteredAndSortedGames);
                return uniqueGames;
            });

            if (newGames.length < size) {
                setHasMore(false);
            }

            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    const filterGamesByPlatform = (platform) => {
        setSelectedPlatform(platform);
        const filteredAndSortedGames = sortAndFilterGames(allGames, platform, sortOrder);
        setGames(filteredAndSortedGames);
    };

    const sortGames = (gamesToSort, order) => {
        let sortedGames = [...gamesToSort];
        if (order === '별점순') {
            sortedGames = sortedGames.sort(
                (a, b) => calculateAverageRating(b.ratings) - calculateAverageRating(a.ratings)
            );
        } else if (order === '댓글순') {
            sortedGames = sortedGames.sort((a, b) => b.totalComments - a.totalComments);
        }
        return sortedGames;
    };

    const sortAndFilterGames = (allGames, platform, order) => {
        let filteredGames = allGames;
        if (platform !== 'All') {
            filteredGames = allGames.filter((game) => game.platform.replace(' 게임', '') === platform);
        }
        return sortGames(filteredGames, order);
    };

    const cleanDeveloperName = (name) => {
        let cleanedName = name.replace(/^(주식회사 |\(주\))/g, '');
        cleanedName = cleanedName.replace(/( 주식회사| Inc\.?| \(유\)| \(주\)|\(주\))$/g, '');
        return cleanedName;
    };

    const cleanGenre = (genre) => {
        return genre.replace(/\(베팅성\)$/, '');
    };

    const calculateAverageRating = (ratings) => {
        if (!ratings || ratings.length === 0) return 0;
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        return (total / ratings.length / 2).toFixed(1);
    };

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        const filteredAndSortedGames = sortAndFilterGames(allGames, selectedPlatform, event.target.value);
        setGames(filteredAndSortedGames);
    };

    const handleGameClick = (gameId) => {
        navigate(`/game/${gameId}`);
    };

    const lastGameObserver = useCallback(
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

    if (loading && page === 0) {
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
        <Box sx={{ padding: '8px', maxWidth: '100%', margin: '0 auto' }}>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    justifyContent: 'center',
                    marginBottom: 2,
                }}
            >
                <Button
                    onClick={() => filterGamesByPlatform('All')}
                    sx={{
                        backgroundColor: selectedPlatform === 'All' ? '#3F3DBD' : '#B4B3F6',
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        padding: '4px 6px',
                        borderRadius: '18px',
                        minWidth: '60px',
                        height: '24px',
                    }}
                >
                    ALL
                </Button>
                <Button
                    onClick={() => filterGamesByPlatform('아케이드')}
                    sx={{
                        backgroundColor: selectedPlatform === '아케이드' ? '#3F3DBD' : '#B4B3F6',
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        padding: '4px 12px',
                        borderRadius: '18px',
                        minWidth: '60px',
                        height: '24px',
                    }}
                >
                    아케이드
                </Button>
                <Button
                    onClick={() => filterGamesByPlatform('PC/온라인')}
                    sx={{
                        backgroundColor: selectedPlatform === 'PC/온라인' ? '#3F3DBD' : '#B4B3F6',
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        padding: '4px 12px',
                        borderRadius: '18px',
                        minWidth: '60px',
                        height: '24px',
                    }}
                >
                    PC/온라인
                </Button>
                <Button
                    onClick={() => filterGamesByPlatform('비디오')}
                    sx={{
                        backgroundColor: selectedPlatform === '비디오' ? '#3F3DBD' : '#B4B3F6',
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        padding: '4px 12px',
                        borderRadius: '18px',
                        minWidth: '60px',
                        height: '24px',
                    }}
                >
                    비디오
                </Button>
                <Button
                    onClick={() => filterGamesByPlatform('모바일')}
                    sx={{
                        backgroundColor: selectedPlatform === '모바일' ? '#3F3DBD' : '#B4B3F6',
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        padding: '4px 12px',
                        borderRadius: '18px',
                        minWidth: '60px',
                        height: '24px',
                    }}
                >
                    모바일
                </Button>
                <Select
                    value={sortOrder}
                    onChange={handleSortChange}
                    sx={{
                        backgroundColor: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        padding: '4px 12px',
                        borderRadius: '18px',
                        minWidth: '80px',
                        height: '24px',
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                maxHeight: 200,
                                fontSize: '0.75rem', // 드롭다운 메뉴의 글자 크기 설정
                            },
                        },
                    }}
                >
                    <MenuItem value="별점순" sx={{ fontSize: '0.75rem' }}>
                        별점순
                    </MenuItem>
                    <MenuItem value="댓글순" sx={{ fontSize: '0.75rem' }}>
                        댓글순
                    </MenuItem>
                </Select>
            </Box>

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
                            key={`list-item-${index}`}
                            ref={games.length === index + 1 ? lastGameObserver : null}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                padding: 2,
                                marginBottom: 4,
                                borderBottom: '1px solid #e0e0e0',
                                wordWrap: 'break-word',
                                width: '100%',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleGameClick(game.id)}
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
                                        {game.totalComments || 0}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {[...Array(5)].map((_, index) => (
                                            <StarIcon
                                                key={index}
                                                sx={{
                                                    fontSize: '14px',
                                                    color:
                                                        index < Math.round(calculateAverageRating(game.ratings))
                                                            ? '#F1C644'
                                                            : '#D4D4D4',
                                                }}
                                            />
                                        ))}
                                        <Typography variant="body2" sx={{ marginLeft: 0.5, fontSize: '0.75rem' }}>
                                            {calculateAverageRating(game.ratings)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, marginTop: 2, marginBottom: 2 }}>
                                <Chip
                                    label={game.platform.replace(' 게임', '')}
                                    sx={{
                                        backgroundColor: '#0A088A',
                                        color: '#fff',
                                        fontSize: '0.65rem',
                                        fontWeight: 'bold',
                                        height: '22px',
                                    }}
                                />
                                <Chip
                                    label={cleanGenre(game.genre)}
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
                                    label={cleanDeveloperName(game.developer)}
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
        </Box>
    );
};

export default GameList;

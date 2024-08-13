import React from 'react';
import { Box, Typography, List, ListItem, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import CommentIcon from '@mui/icons-material/Comment';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchResults = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchResults = location.state?.searchResults || []; // searchResults를 location.state에서 가져옴

    const handleGameClick = (gameId) => {
        navigate(`/game/${gameId}`);
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

    if (searchResults.length === 0) {
        return (
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
                검색 결과가 없습니다.
            </Typography>
        );
    }

    return (
        <Box sx={{ padding: '8px', maxWidth: '100%', margin: '0 auto' }}>
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
                    {searchResults.map((game, index) => (
                        <ListItem
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
            </Box>
        </Box>
    );
};

export default SearchResults;

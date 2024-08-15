import React, { useState } from 'react';
import { Box, Typography, List, ListItem, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FavoriteGamesForMyPage = ({ games }) => {
    const navigate = useNavigate();
    const [visibleGames, setVisibleGames] = useState(3); // 처음에는 3개의 게임만 표시

    const cleanDeveloperName = (name) => {
        let cleanedName = name.replace(/^(주식회사 |\(주\))/g, '');
        cleanedName = cleanedName.replace(/( 주식회사| Inc\.?| \(유\)| \(주\)|\(주\))$/g, '');
        return cleanedName;
    };

    const cleanGenre = (genre) => {
        return genre.replace(/\(베팅성\)$/, '');
    };

    const handleGameClick = (gameId) => {
        navigate(`/game/${gameId}`);
    };

    const handleShowMore = () => {
        navigate('/favoritegamelist');
    };

    if (games.length === 0) {
        return (
            <Box
                sx={{
                    bgcolor: '#fff',
                    paddingTop: 2,
                    paddingBottom: 0,
                    borderRadius: 1,
                    minHeight: '100px',
                    marginBottom: 2,
                    marginTop: 2,
                    boxShadow: 3,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                            paddingLeft: 2,
                            paddingBottom: 1,
                            fontFamily: 'Roboto, sans-serif',
                            fontWeight: 700,
                            fontSize: '14pt',
                            letterSpacing: '-0.5px',
                            borderBottom: '1px solid #e0e0e0'
                    }}
                >
                    선호 게임 목록
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center', // 중앙 정렬
                        marginTop: 2,
                        borderRadius: 1,
                        wordWrap: 'break-word',
                        width: '100%',
                    }}
                >
                    <Typography>
                        선호하는 게임이 없습니다.
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                bgcolor: '#fff',
                paddingTop: 2,
                paddingBottom: 0,
                borderRadius: 1,
                minHeight: '100px',
                marginBottom: 2,
                marginTop: 2,
                boxShadow: 3,
            }}
        >
            <Typography
                variant="h6"
                sx={{
                        paddingLeft: 2,
                        paddingBottom: 1,
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        fontSize: '14pt',
                        letterSpacing: '-0.5px',
                        borderBottom: '1px solid #e0e0e0'
                }}
            >
                선호 게임 목록
            </Typography>
            <List>
                {games.slice(0, visibleGames).map((gameData, index) => {
                    const game = gameData.game;
                    return (
                        <ListItem>
                            <Box
                                key={`list-item-${index}`}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center', // 중앙 정렬
                                    paddingRight: 2,
                                    paddingLeft: 2,
                                    borderRadius: 1,
                                    borderBottom: '1px solid #e0e0e0',
                                    wordWrap: 'break-word',
                                    width: '100%',
                                    cursor: 'pointer',
                                }}
                                onClick={() => handleGameClick(game.id)}
                            >
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        fontWeight: 'bold',
                                        textAlign: 'center', // 텍스트 중앙 정렬
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    {game.title}
                                </Typography>
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
                            </Box>
                        </ListItem>
                    );
                })}
            {games.length > 3 && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={(handleShowMore)} sx={{ color: 'rgba(10, 8, 138)' }}>
                        더보기
                    </Button>
                </div>
            )}
            </List>
        </Box>
    );
};

export default FavoriteGamesForMyPage;
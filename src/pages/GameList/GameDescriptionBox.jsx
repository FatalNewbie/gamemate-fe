import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Divider, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import AddGameModal from './AddGameModal';
import DeleteGameModal from './DeleteGameModal';
import LoginRequiredModal from './LoginRequiredModal';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const GameDescriptionBox = ({ game, chipStyle, cleanDeveloperName, cleanGenre }) => {
    const [isGameInList, setIsGameInList] = useState(false);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openLoginModal, setOpenLoginModal] = useState(false);
    const [cookies] = useCookies(['token']);
    const isLoggedIn = !!cookies.token;

    useEffect(() => {
        if (isLoggedIn) {
            const checkGameInList = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/games/my-games/${game.id}/exists`, {
                        headers: {
                            Authorization: `${cookies.token}`,
                        },
                    });
                    if (response.data && response.data.data) {
                        setIsGameInList(true);
                    } else {
                        setIsGameInList(false);
                    }
                } catch (error) {
                    console.error('Error checking if game is in list:', error);
                    setIsGameInList(false);
                }
            };
            checkGameInList();
        }
    }, [game.id, cookies.token, isLoggedIn]);

    const handleAddGameClick = () => {
        if (isLoggedIn) {
            if (isGameInList) {
                setOpenDeleteModal(true);
            } else {
                setOpenAddModal(true);
            }
        } else {
            setOpenLoginModal(true);
        }
    };

    const handleGameAdded = () => {
        setIsGameInList(true);
        setOpenAddModal(false);
    };

    const handleGameDeleted = () => {
        setIsGameInList(false);
        setOpenDeleteModal(false);
    };

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
                                maxWidth: '100%',
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: '0.65rem',
                                    marginRight: '8px',
                                    whiteSpace: 'nowrap',
                                    wordBreak: 'break-word',
                                }}
                            >
                                개발사
                            </Typography>
                            <Chip
                                label={cleanDeveloperName(game.developer)}
                                sx={{
                                    ...chipStyle,
                                    backgroundColor: '#8F8EC9',
                                    whiteSpace: 'normal',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-all',
                                    maxWidth: '100px', // Reduced maxWidth to prevent overflow
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                marginBottom: '8px',
                                maxWidth: '100%',
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: '0.65rem',
                                    marginRight: '8px',
                                    whiteSpace: 'nowrap',
                                    wordBreak: 'break-word',
                                }}
                            >
                                장르
                            </Typography>
                            <Chip
                                label={cleanGenre(game.genre)}
                                sx={{
                                    ...chipStyle,
                                    backgroundColor: '#5D5AE0',
                                    whiteSpace: 'normal',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-all',
                                    maxWidth: '100px',
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                marginBottom: '8px',
                                maxWidth: '100%',
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: '0.65rem',
                                    marginRight: '8px',
                                    whiteSpace: 'nowrap',
                                    wordBreak: 'break-word',
                                }}
                            >
                                플랫폼
                            </Typography>
                            <Chip
                                label={game.platform}
                                sx={{
                                    ...chipStyle,
                                    backgroundColor: '#0A088A',
                                    whiteSpace: 'normal',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-all',
                                    maxWidth: '100px',
                                }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontSize: '0.65rem',
                                    marginRight: '8px',
                                    whiteSpace: 'nowrap',
                                    wordBreak: 'break-word',
                                }}
                            >
                                등급
                            </Typography>
                            <Chip
                                label={game.classes}
                                sx={{
                                    ...chipStyle,
                                    backgroundColor: '#8F8EC9',
                                    whiteSpace: 'normal',
                                    overflowWrap: 'break-word',
                                    wordBreak: 'break-all',
                                    maxWidth: '100px',
                                }}
                            />
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

            <Button
                variant="contained"
                sx={{
                    backgroundColor: '#0A088A',
                    color: '#fff',
                    borderRadius: '30px',
                    fontWeight: 'bold',
                    width: '280px',
                    height: '60px',
                    marginTop: '20px',
                    display: 'block',
                    mx: 'auto',
                    fontSize: '11pt',
                    textAlign: 'center',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    '&:hover': {
                        backgroundColor: '#8F8EC9',
                    },
                }}
                onClick={handleAddGameClick}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SportsEsportsIcon sx={{ marginRight: '8px' }} /> 선호 게임 목록에 추가
                </Box>
            </Button>

            <AddGameModal
                open={openAddModal}
                onClose={() => setOpenAddModal(false)}
                gameId={game.id}
                onGameAdded={handleGameAdded}
            />

            <DeleteGameModal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                gameId={game.id}
                onGameDeleted={handleGameDeleted}
            />

            <LoginRequiredModal open={openLoginModal} onClose={() => setOpenLoginModal(false)} />
        </>
    );
};

export default GameDescriptionBox;

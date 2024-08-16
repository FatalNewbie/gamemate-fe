import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Chip, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const searchInputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        setRecentSearches(storedSearches);

        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    const executeSearch = async (query) => {
        if (query.trim() !== '') {
            try {
                const response = await axios.get('/games', {
                    params: { title: query },
                });

                const searchResults = response.data.data.content;
                navigate('/search-results', { state: { searchResults } });

                const updatedSearches = [query, ...recentSearches.filter((item) => item !== query)].slice(0, 5);
                setRecentSearches(updatedSearches);
                localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
                setSearchQuery('');
                onClose(); // 모달을 닫기
            } catch (error) {
                console.error('검색 중 오류 발생:', error);
            }
        }
    };

    const handleSearch = () => {
        executeSearch(searchQuery);
    };

    const handleChipClick = (query) => {
        executeSearch(query);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleDelete = (chipToDelete) => () => {
        const updatedSearches = recentSearches.filter((search) => search !== chipToDelete);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
            minHeight="100vh"
            bgcolor="rgba(0, 0, 0, 0.5)"
            p={2}
            position="fixed"
            top={0}
            left={0}
            right={0}
            zIndex={1300}
        >
            <Box width="100%" maxWidth="360px" p={2} bgcolor="white" boxShadow={1} borderRadius={1} position="relative">
                <Box display="flex" alignItems="center">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="검색창"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        inputRef={searchInputRef}
                        InputProps={{
                            endAdornment: (
                                <IconButton size="small" onClick={handleSearch}>
                                    <SearchIcon />
                                </IconButton>
                            ),
                            sx: {
                                borderRadius: '20px',
                                height: '36px',
                                fontSize: '0.875rem',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(0, 0, 0, 0.23)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#0A088A',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#0A088A',
                                },
                            },
                        }}
                    />
                    <IconButton onClick={onClose} sx={{ padding: 0, marginLeft: 1 }}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Box mt={2}>
                    <Typography variant="subtitle2" gutterBottom>
                        🔥 추천검색
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1} mb={2}>
                        <Chip label="리그오브레전드" onClick={() => handleChipClick('리그오브레전드')} />
                        <Chip label="배틀그라운드" onClick={() => handleChipClick('배틀그라운드')} />
                        <Chip label="데이브 더 다이버" onClick={() => handleChipClick('데이브 더 다이버')} />
                    </Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ marginTop: 3 }}>
                        🔍 최근검색
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                        {recentSearches.length === 0 ? (
                            <Typography
                                variant="body2"
                                color="textSecondary"
                                sx={{ marginTop: 1, marginBottom: 2, textAlign: 'center', width: '100%' }}
                            >
                                최근 검색기록이 없습니다.
                            </Typography>
                        ) : (
                            recentSearches.map((search, index) => (
                                <Chip
                                    key={index}
                                    label={search}
                                    onClick={() => handleChipClick(search)}
                                    onDelete={handleDelete(search)}
                                />
                            ))
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SearchBar;

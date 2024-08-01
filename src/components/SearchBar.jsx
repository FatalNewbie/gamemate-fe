import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, IconButton, Chip, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const SearchBar = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const searchInputRef = useRef(null); // 검색창에 포커스를 맞추기 위한 useRef

    useEffect(() => {
        const storedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
        setRecentSearches(storedSearches);

        // 컴포넌트가 마운트되면 검색창에 자동으로 포커스를 맞춥니다.
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim() !== '') {
            const updatedSearches = [searchQuery, ...recentSearches.filter((item) => item !== searchQuery)].slice(0, 5);
            setRecentSearches(updatedSearches);
            localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
            setSearchQuery('');
        }
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
                        inputRef={searchInputRef} // 검색창에 포커스를 맞추기 위한 ref 연결
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
                                    borderColor: 'rgba(0, 0, 0, 0.23)', // 기본 테두리 색상
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#0A088A', // 마우스 오버 시 테두리 색상
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#0A088A', // 포커스 시 테두리 색상
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
                        <Chip label="리그오브레전드" />
                        <Chip label="배틀그라운드" />
                        <Chip label="데이브 더 다이버" />
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
                                <Chip key={index} label={search} onDelete={handleDelete(search)} />
                            ))
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SearchBar;

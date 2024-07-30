// src/components/SearchBar.js
import React, { useState } from 'react';
import { Box, TextField, IconButton, Chip, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const SearchBar = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleDelete = (chipToDelete) => () => {
        console.log(`${chipToDelete} 삭제`);
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
            <Box width="100%" maxWidth="390px" p={2} bgcolor="white" boxShadow={1} borderRadius={1} position="relative">
                <Box display="flex" alignItems="center">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="검색창"
                        value={searchQuery}
                        onChange={handleSearch}
                        InputProps={{
                            endAdornment: (
                                <IconButton size="small">
                                    <SearchIcon />
                                </IconButton>
                            ),
                            sx: {
                                borderRadius: '20px', // 둥글게 설정
                                height: '36px', // 세로 크기 조정
                                fontSize: '0.875rem', // 글자 크기 조정
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
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        <Chip label="리그오브레전드" />
                        <Chip label="배틀그라운드" />
                        <Chip label="데이브 더 다이버" />
                    </Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ marginTop: 2 }}>
                        🔍 최근검색
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        <Chip label="스타듀밸리" onDelete={handleDelete('스타듀밸리')} />
                        <Chip label="리그오브레전드" onDelete={handleDelete('리그오브레전드')} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SearchBar;

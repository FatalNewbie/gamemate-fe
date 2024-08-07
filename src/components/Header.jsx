import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
const Header = ({ title, showSearchIcon = true, onSearchClick, setActivePage }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMyPageClick = () => {
        setActivePage('/mypage'); // 푸터의 activePage 상태 업데이트
        navigate('/mypage');
        handleMenuClose();
    };

    return (
        <AppBar
            position="static"
            sx={{
                bgcolor: 'white',
                color: 'black',
                boxShadow: 'none',
                height: 65,
                paddingTop: '4px',
            }}
        >
            <Toolbar sx={{ minHeight: 65 }}>
                <img src={logo} alt="Logo" style={{ width: 32, height: 32, marginRight: 8 }} />
                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                        fontFamily: 'Roboto, sans-serif',
                        fontWeight: 700,
                        fontSize: '18pt',
                        letterSpacing: '-0.5px',
                    }}
                >
                    {title}
                </Typography>
                {showSearchIcon && (
                    <IconButton edge="end" color="inherit" onClick={onSearchClick} disableRipple>
                        <SearchIcon />
                    </IconButton>
                )}
                <IconButton edge="end" color="inherit" onClick={handleMenuOpen} disableRipple>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    sx={{
                        '& .MuiPaper-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', // 불투명도 80%로 설정
                            borderRadius: '5px',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            minWidth: '80px',
                        },
                        '& .MuiMenuItem-root': {
                            fontSize: '10px', // 텍스트 크기 설정
                            padding: '4px 12px', // 텍스트 사이의 상하 여백 줄임
                            textAlign: 'center', // 텍스트 중앙 정렬
                            justifyContent: 'center', // 텍스트 중앙 정렬
                            fontFamily: 'Roboto', // 폰트 패밀리 설정
                            fontWeight: 'bold', // 글씨체 bold 설정
                            '&:hover': {
                                backgroundColor: 'rgba(223, 223, 245, 0.5)',
                                borderRadius: '5px',
                            },
                        },
                    }}
                >
                    <MenuItem onClick={handleMyPageClick}>마이페이지</MenuItem>
                    <MenuItem onClick={handleMenuClose}>로그아웃</MenuItem>
                    <MenuItem onClick={handleMenuClose}>회원탈퇴</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
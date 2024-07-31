// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = ({ title, showSearchIcon = true, onSearchClick, onAccountClick }) => {
    const navigate = useNavigate();

    const handleAccountClick = () => {
        if (onAccountClick) {
            onAccountClick();
        } else {
            navigate('/mypage');
        }
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
                <IconButton edge="end" color="inherit" onClick={handleAccountClick} disableRipple>
                    <AccountCircleIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';

const MainLayout = ({ children, headerTitle, showSearchIcon = true }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleSearchOpen = () => {
        setIsSearchOpen(true);
    };

    const handleSearchClose = () => {
        setIsSearchOpen(false);
    };

    useEffect(() => {
        function setVh() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        window.addEventListener('resize', setVh);
        window.addEventListener('load', setVh);

        setVh();

        return () => {
            window.removeEventListener('resize', setVh);
            window.removeEventListener('load', setVh);
        };
    }, []);

    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: '390px',
                margin: '0 auto',
                height: 'calc(var(--vh, 1vh) * 100)',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: isSearchOpen ? 'rgba(0, 0, 0, 0.5)' : '#f0f0f0',
                position: 'relative',
                paddingTop: '65px', // Header 높이만큼 여백 추가
                paddingBottom: '70px', // Footer 높이만큼 여백 추가
                boxSizing: 'border-box', // 패딩이 레이아웃에 포함되도록 설정
            }}
        >
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    maxWidth: '390px',
                    width: '100%',
                    zIndex: 1000,
                    bgcolor: isSearchOpen ? 'rgba(0, 0, 0, 0.5)' : '#fff',
                    margin: '0 auto',
                    transition: 'background-color 0.3s ease',
                }}
            >
                <Header title={headerTitle} showSearchIcon={showSearchIcon} onSearchClick={handleSearchOpen} />
            </Box>
            <Box
                component="main"
                flexGrow={1}
                overflow="auto"
                p={2}
                sx={{
                    backgroundColor: isSearchOpen ? 'rgba(0, 0, 0, 0.5)' : 'inherit',
                }}
            >
                {children}
            </Box>
            <Footer />
            {isSearchOpen && (
                <Box
                    position="fixed"
                    top={65}
                    left={0}
                    right={0}
                    bottom={0}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    bgcolor="rgba(0, 0, 0, 0.5)"
                    zIndex={1300}
                >
                    <SearchBar onClose={handleSearchClose} />
                </Box>
            )}
        </Box>
    );
};

export default MainLayout;

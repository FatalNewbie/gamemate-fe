import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';

const MainLayout = ({ children, headerTitle, showSearchIcon = true }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activePage, setActivePage] = useState('home'); // 전역 상태 추가

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

        setVh();
        window.addEventListener('resize', setVh);
        window.addEventListener('load', setVh);

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
                position: 'relative',
                paddingTop: '65px',
                paddingBottom: '70px',
                '@media (min-width: 769px)': {
                    paddingTop: '65px',
                    paddingBottom: '70px',
                },
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
                    margin: '0 auto',
                }}
            >
                <Header
                    title={headerTitle}
                    showSearchIcon={showSearchIcon}
                    onSearchClick={handleSearchOpen}
                    activePage={activePage}
                    setActivePage={setActivePage} // 전역 상태 전달
                />
            </Box>
            <Box component="main" flexGrow={1} overflow="auto" p={2}>
                {children}
            </Box>
            <Footer activePage={activePage} setActivePage={setActivePage} /> {/* 전역 상태 전달 */}
            {isSearchOpen && (
                <Box
                    position="fixed"
                    top={0}
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

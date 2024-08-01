// src/layouts/MainLayout.js
import React, { useState } from 'react';
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

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f0f0f0">
            <Box
                display="flex"
                flexDirection="column"
                width="100%"
                maxWidth="390px"
                height="100vh"
                bgcolor="#fff"
                boxShadow={3}
            >
                <Header title={headerTitle} showSearchIcon={showSearchIcon} onSearchClick={handleSearchOpen} />
                <Box component="main" flexGrow={1} overflow="auto" p={2} paddingBottom="70px">
                    {children}
                </Box>
                <Footer />
                {isSearchOpen && (
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        bgcolor="rgba(0, 0, 0, 0.5)"
                    >
                        <SearchBar onClose={handleSearchClose} />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default MainLayout;

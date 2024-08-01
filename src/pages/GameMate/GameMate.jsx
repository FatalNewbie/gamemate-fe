import React from 'react';
import { Box, Typography } from '@mui/material';

const GameMate = () => {
    return (
        <Box>
            {Array.from({ length: 50 }).map((_, index) => (
                <Typography variant="h4" key={index}>
                    게임메이트
                </Typography>
            ))}
        </Box>
    );
};

export default GameMate;

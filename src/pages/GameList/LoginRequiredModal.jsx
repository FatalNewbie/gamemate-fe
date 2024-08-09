import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const LoginRequiredModal = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ style: { padding: '20px', borderRadius: '10px' } }}>
            <DialogTitle sx={{ padding: '8px 16px', fontSize: '1rem', fontWeight: 'bold' }}>
                ⛔ 경고
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: '8px', top: '8px' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ textAlign: 'center', padding: '8px 16px' }}>
                <Typography variant="body2" sx={{ marginTop: '20px', marginBottom: '10px', fontSize: '0.875rem' }}>
                    로그인 후 이용하실 수 있습니다!
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#0A088A',
                        color: '#fff',
                        borderRadius: '30px',
                        fontWeight: 'bold',
                        padding: '8px 30px',
                        '&:hover': {
                            backgroundColor: '#8F8EC9',
                        },
                        marginTop: '20px', // 버튼과 내용 사이 여백
                    }}
                    onClick={onClose}
                >
                    확인
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default LoginRequiredModal;

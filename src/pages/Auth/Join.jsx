import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Dialog } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../assets/logo.png';

const Join = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(true); // 회원가입 상태
    const [open, setOpen] = useState(false); // 모달 열기 상태

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleStartRegister = () => {
        setIsRegistering(false); // 회원가입 상태를 false로 변경
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/join', {
                username,
                password,
                nickname
            });

            if (response.status === 200) {
                navigate('/login');
                handleClose(); // 모달 닫기
            }
        } catch (error) {
            console.error('회원가입 실패:', error);
            if (error.response) {
                const errorData = error.response.data;
                if (errorData.success === false) {
                    if (errorData.username) {
                        alert(errorData.username);
                    }
                    if (errorData.errors) {
                        if (errorData.errors.password) {
                            alert(errorData.errors.password);
                        }
                    }
                }
            } else {
                alert('회원가입에 실패했습니다. 다시 시도해주세요.');
            }
        }
    };

    return (
        <Container maxWidth="xs" style={{ marginTop: '50px' }}>
            <Box display="flex" alignItems="center" mt={15} mb={15}>
                <img src={logo} alt="Logo" style={{ width: 70, height: 70 }} />
                <Typography variant="h3">게임메이트</Typography>
            </Box>
            <Button variant="contained" onClick={handleClickOpen} fullWidth>
                이메일 계정으로 시작하기
            </Button>
            <Dialog open={open}
                    onClose={handleClose}
                    fullWidth
//                     maxWidth="xs"
                    PaperProps={{ style: { maxWidth: '370px' } }}>
                <Box sx={{
                    padding: 2,
                    boxShadow: 3,
                }}>
                    <Typography variant="h4" align="center">회원가입</Typography>
                    <Typography variant="body2" align="center">
                        이미 계정이 있으신가요? <Button onClick={() => navigate('/login')}>로그인</Button>
                    </Typography>
                    {error && <Typography color="error" align="center">{error}</Typography>}
                    <TextField
                        label="이메일 입력"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="비밀번호 입력"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        label="비밀번호 확인"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <TextField
                        label="닉네임 입력"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        required
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ marginTop: '16px' }}>
                        가입하기
                    </Button>
                </Box>
            </Dialog>
        </Container>
    );
};

export default Join;

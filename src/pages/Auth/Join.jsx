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

    const handleSubmit = (e) => {
        e.preventDefault();

        // 이메일 형식 검사
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(username)) {
            alert('유효한 이메일 주소를 입력해 주세요.');
            return;
        }

        // 비밀번호 형식 검사
        const passwordPattern = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(password)) {
            alert('비밀번호는 최소 8자 이상이며 소문자, 숫자, 특수 문자를 포함해야 합니다.');
            return;
        }

        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        navigate('/join-additional', { state: { username, password, nickname } });
    };

    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/google"
    };

    const onNaverLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/naver"
    }

    return (
        <Container maxWidth="xs" style={{ marginTop: '50px' }}>
            <Box display="flex" alignItems="center" mt={15} mb={15}>
                <img src={logo} alt="Logo" style={{ width: 70, height: 70 }} />
                <Typography variant="h3">게임메이트</Typography>
            </Box>
            <Box mt={2}>
                <Button
                    variant="outlined"
                    startIcon={<img src={process.env.PUBLIC_URL + '/googleLogo.png'} alt="Google Icon" style={{ width: 20, height: 20, marginRight: 10 }} />}
                    fullWidth
                    onClick={handleGoogleLogin}
                >
                    구글 계정으로 시작하기
                </Button>
            </Box>
            <Box mt={2}>
                <Button
                    variant="outlined"
                    startIcon={<img src={process.env.PUBLIC_URL + '/naverLogo.png'} alt="Naver Icon" style={{ width: 23, height: 23, marginRight: 10 }} />}
                    fullWidth
                    onClick={onNaverLogin}
                >
                    네이버 계정으로 시작하기
                </Button>
            </Box>
            <Box mt={2}>
                <Button variant="contained" onClick={handleClickOpen} fullWidth>
                    이메일 계정으로 시작하기
                </Button>
            </Box>
            <Typography variant="body2" align="center" style={{ marginTop: 5}} >
                이미 계정이 있으신가요? <Button onClick={() => navigate('/login')}>로그인</Button>
            </Typography>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                PaperProps={{ style: { maxWidth: '370px' } }}
            >
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
                        다음
                    </Button>
                </Box>
            </Dialog>
        </Container>
    );
};

export default Join;

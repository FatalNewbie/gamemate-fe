import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Dialog, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import logo from '../../assets/logo.png';

const Join = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [cookies, setCookie] = useCookies(['token']);
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(true); // 회원가입 상태
    const [open, setOpen] = useState(false); // 모달 열기 상태
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

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

//     const handleGoogleLogin = () => {
//         window.location.href = "http://localhost:8080/oauth2/authorization/google"
//     };

//     const onNaverLogin = () => {
//         fetch("/naver-login", {
//             method: "GET",
//             redirect: "follow"
//         }).then(response => {
//             if (response.redirected) {
//                 window.location.href = response.url; // 서버에서 생성한 Naver 로그인 URL로 리디렉션
//             }
//         }).catch(error => console.error('Error:', error));
//     };

//     const onNaverLogin = () => {
//         window.location.href = "http://localhost:8080/oauth2/authorization/naver"
//     };
//
//     useEffect(() => {
//         const fetchJwtToken = async () => {
//             try {
//                 const dataResponse = await axios.get("/token", { withCredentials: true });
//                 const jwtToken = dataResponse.headers['Authorization'];
//
//                 if (jwtToken) {
//                     const tokenValue = jwtToken.replace(`Bearer `, ``);
//                     localStorage.setItem('token', tokenValue);
//                     alert('로그인 성공');
//                     navigate('/'); // JWT 저장 후 대시보드로 리디렉션
//                 } else {
//                     alert('토큰을 받아오지 못했습니다.');
//                 }
//             } catch (error) {
//                 console.error('로그인 중 오류 발생:', error);
//                 alert('로그인 실패. 다시 시도해 주세요.');
//             }
//         };
//
//         if (isLoggedIn) {
//             fetchJwtToken(); // 로그인 상태가 true일 때만 JWT 요청
//         }
//     }, [isLoggedIn, navigate]); // 로그인 상태에 따라 호출

    const handleLogin = async (e) => {
        e.preventDefault();

        // 이메일 형식 검사
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(username)) {
            alert('유효한 이메일 주소를 입력해 주세요.');
            return;
        }

        try {
            const response = await axios.post(
                '/login',
                {
                    username,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                const token = response.headers['authorization'];

                console.log('로그인 성공, 쿠키 설정 전');
                setCookie('token', token);

                const updatedCookies = { ...cookies, token }; // 직접 업데이트된 쿠키 객체 생성
                console.log('로그인 성공, 쿠키 설정 후:', updatedCookies.token);

                navigate('/home');
            } else {
                throw new Error(`${response.data.errorCode}: ${response.data.errorMessage}`);
            }
        } catch (error) {
            // 서버에서 에러 응답을 받았을 경우
            if (error.response) {
                const errorData = error.response.data;
                const errorCode = errorData.code || 'LOGIN_FAILED';
                const errorMessage = errorData.message || '로그인 중 오류가 발생했습니다.';

                if (errorCode === 'ACCOUNT_DISABLED') {
                    alert('계정이 비활성화되었습니다. 관리자에게 문의하세요.');
                } else if (errorCode === 'INVALID_PASSWORD') {
                    alert('비밀번호가 틀렸습니다. 다시 시도해 주세요.');
                } else if (errorCode === 'USER_NOT_FOUND') {
                    alert('존재하지 않는 계정입니다. 새로운 계정을 만들어주세요.');
                } else {
                    alert(errorMessage);
                }
            } else {
                // 네트워크 오류 등으로 인해 error.response가 없는 경우
                alert('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
            }

            console.error('Login error:', error);
        }
    };

    return (
        <Container maxWidth="xs" style={{ marginTop: '50px' }}>
            <Box display="flex" alignItems="center" mt={15} mb={15}>
                <img src={logo} alt="Logo" style={{ width: 70, height: 70 }} />
                <Typography variant="h3">게임메이트</Typography>
            </Box>
{/*             <Box mt={2}> */}
{/*                 <Button */}
{/*                     variant="outlined" */}
{/*                     startIcon={<img src={process.env.PUBLIC_URL + '/googleLogo.png'} alt="Google Icon" style={{ width: 20, height: 20, marginRight: 10 }} />} */}
{/*                     fullWidth */}
{/*                     onClick={handleGoogleLogin} */}
{/*                 > */}
{/*                     구&nbsp;&nbsp;글&nbsp;&nbsp;계정으로&nbsp;&nbsp;회원가입 */}
{/*                 </Button> */}
{/*             </Box> */}
{/*             <Box mt={2}> */}
{/*                 <Button */}
{/*                     variant="outlined" */}
{/*                     startIcon={<img src={process.env.PUBLIC_URL + '/naverLogo.png'} alt="Naver Icon" style={{ width: 23, height: 23, marginRight: 10 }} />} */}
{/*                     fullWidth */}
{/*                     onClick={onNaverLogin} */}
{/*                 > */}
{/*                     네이버 계정으로 회원가입 */}
{/*                 </Button> */}
{/*             </Box> */}
            <form onSubmit={handleLogin}>
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
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ backgroundColor: '#0A088A', '&:hover': { backgroundColor: '#5D5AE0' }, marginTop: '16px'}}
                >
                    로그인
                </Button>
            </form>
            <Divider style={{ margin: '20px 0' }}>또는</Divider>
            <Box mt={2}>
                <Button
                    variant="contained"
                    onClick={handleClickOpen}
                    fullWidth
                    sx={{ backgroundColor: '#0A088A', '&:hover': { backgroundColor: '#5D5AE0' }}}
                >
                    회원가입
                </Button>
            </Box>
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

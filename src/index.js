import React from 'react';
import ReactDOM from 'react-dom/client'; // createRoot 메서드를 사용하기 위해서
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CookiesProvider } from 'react-cookie';
import ReactGA from 'react-ga4';

//Measurement Id 설정
ReactGA.initialize('G-3HDE4GZJ48');

// ReactDOM.createRoot 사용
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CookiesProvider>
        <App />
    </CookiesProvider>
);

// JavaScript로 실제 vh를 계산하여 CSS 변수에 설정
function setVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// 페이지가 로드될 때와 리사이즈될 때 vh를 계산
window.addEventListener('resize', setVh);
window.addEventListener('load', setVh);

// 초기화 시점에 한번 실행
setVh();

// 성능 측정을 위한 reportWebVitals 호출
reportWebVitals();

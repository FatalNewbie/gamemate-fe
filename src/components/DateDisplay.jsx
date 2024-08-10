import React from 'react';
import { formatDate } from '../utils/formatDate'; // formatDate 함수 가져오기

const DateDisplay = ({ dateString }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}.${month}.${day} ${hours}:${minutes}`;
    };

    return <div className="date-display">{formatDate(dateString)}</div>;
};

export default DateDisplay;

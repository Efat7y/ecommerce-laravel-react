import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ endTime }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = +new Date(endTime) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }
        return timeLeft;
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = [];
    
    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && interval === 'days') {
            return;
        }

        timerComponents.push(
            <div key={interval} className="flex flex-col items-center justify-center bg-red-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-xl shadow-lg">
                <span className="text-xl md:text-2xl font-bold">{timeLeft[interval].toString().padStart(2, '0')}</span>
                <span className="text-xs uppercase opacity-80">{
                    interval === 'days' ? 'أيام' :
                    interval === 'hours' ? 'ساعات' :
                    interval === 'minutes' ? 'دقائق' : 'ثواني'
                }</span>
            </div>
        );
    });

    return (
        <div className="flex gap-2 md:gap-4 items-center justify-center md:justify-start" dir="ltr">
            {timerComponents.length ? timerComponents : <span className="text-red-500 font-bold">انتهى العرض!</span>}
        </div>
    );
}

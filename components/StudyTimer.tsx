
import React, { useState, useEffect, useRef } from 'react';

interface StudyTimerProps {
    addStudyTime: (seconds: number) => void;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ addStudyTime }) => {
    const [time, setTime] = useState(25 * 60); // 25 minutes
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isActive && time > 0) {
            intervalRef.current = window.setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (!isActive && intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }

        if (time === 0) {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
            if (isActive) { // only trigger if it was running
              setIsActive(false);
              addStudyTime(25 * 60);
              alert("Great job! Session complete. Added 25 minutes to your study time.");
            }
        }

        return () => {
            if (intervalRef.current !== null) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, time, addStudyTime]);

    const toggle = () => {
        if (time > 0) {
          setIsActive(!isActive);
        }
    };

    const reset = () => {
        setIsActive(false);
        setTime(25 * 60);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <p className="text-4xl font-bold font-mono text-gray-800">{formatTime(time)}</p>
            <div className="flex space-x-3 mt-4">
                <button
                    onClick={toggle}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg text-white ${isActive ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'}`}
                    disabled={time === 0}
                >
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button
                    onClick={reset}
                    className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default StudyTimer;

'use client';

import { getAssetPath } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WarningModal({ isOpen, onClose }: WarningModalProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAlert, setIsPlayingAlert] = useState(false);
  const [isPlayingAlertOff, setIsPlayingAlertOff] = useState(false);

  const playWaveSound = useCallback(() => {
    try {
      // If already playing, stop it
      if (audioRef.current && isPlayingAlert) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
        setIsPlayingAlert(false);
        setIsPlayingAlertOff(false);
        return;
      }

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(getAssetPath('/audio/alert.wav'));
      audioRef.current = audio;
      setIsPlayingAlert(true);
      setIsPlayingAlertOff(false);

      audio.addEventListener('ended', () => {
        setIsPlayingAlert(false);
      });

      audio.play().catch(error => {
        console.error('Error playing alert sound:', error);
        setIsPlayingAlert(false);
      });
    } catch (error) {
      console.error('Error creating audio:', error);
      setIsPlayingAlert(false);
    }
  }, [isPlayingAlert]);

  const playWaveOffSound = useCallback(() => {
    try {
      // If already playing, stop it
      if (audioRef.current && isPlayingAlertOff) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
        setIsPlayingAlert(false);
        setIsPlayingAlertOff(false);
        return;
      }

      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(getAssetPath('/audio/alert_off.mp3'));
      audioRef.current = audio;
      setIsPlayingAlertOff(true);
      setIsPlayingAlert(false);

      audio.addEventListener('ended', () => {
        setIsPlayingAlertOff(false);
      });

      audio.play().catch(() => {
        setIsPlayingAlertOff(false);
      });
    } catch (error) {
      console.error('Error creating audio:', error);
      setIsPlayingAlertOff(false);
    }
  }, [isPlayingAlertOff]);

  // Stop audio when modal closes
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlayingAlert(false);
      setIsPlayingAlertOff(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1001 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[4px]" onClick={onClose} />
      <div className="relative bg-[var(--text-black)] rounded-[20px] max-w-md w-full p-6 shadow-2xl flex flex-col gap-6">
        <header className="relative h-[25px] flex items-center justify-center">
          {/* 標題 */}
          <h2 className="h-[25px] text-[20px] font-medium text-white text-center leading-[25px]">
            避難守則
          </h2>
          {/* 關閉按鈕：移到右側，使用絕對定位保持標題置中 */}
          <button
            onClick={onClose}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 text-2xl w-6 h-6 flex items-center justify-center cursor-pointer"
            aria-label="關閉視窗"
          >
            ✕
          </button>
        </header>

        {/* 內容 */}
        <div className="text-white">
          <p className="text-2xl font-medium text-center text-white">堰塞湖隨時有溢流風險</p>
          <p className="text-[28px] leading-[35px] font-bold text-center text-[#F23555]">
            若警報響起，請儘速往
            <br />
            高處或高樓層避難
          </p>
        </div>

        {/* 警報說明 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-5 bg-[#343434] rounded-[16px] p-4">
            <div className="h-12 w-12 flex items-center justify-center">
              <button
                onClick={playWaveSound}
                className="cursor-pointer hover:opacity-70 transition-opacity"
                aria-label="播放海嘯警報音效"
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 35.9502V31.8502C25 30.9835 27.4167 29.3169 29.25 26.8502C31.0833 24.3835 32 21.5835 32 18.4502C32 15.3169 31.0833 12.5169 29.25 10.0502C27.4167 7.58353 25 5.91686 22 5.0502V0.950195C26.1333 1.88353 29.5 3.9752 32.1 7.2252C34.7 10.4752 36 14.2169 36 18.4502C36 22.6835 34.7 26.4252 32.1 29.6752C29.5 32.9252 26.1333 35.0169 22 35.9502ZM0 24.5002V12.5002H8L18 2.5002V34.5002L8 24.5002H0ZM22 26.5002V10.4002C23.5667 11.1335 24.7917 12.2335 25.675 13.7002C26.5583 15.1669 27 16.7669 27 18.5002C27 20.2002 26.5583 21.7752 25.675 23.2252C24.7917 24.6752 23.5667 25.7669 22 26.5002ZM14 12.2002L9.7 16.5002H4V20.5002H9.7L14 24.8002V12.2002Z"
                    fill={isPlayingAlert ? '#F23555' : 'white'}
                    className="transition-colors"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 text-white">
              <p className="font-bold h-[25px]">海嘯警報（無語音）</p>
              <p className="text-base leading-5">鳴5秒、停5秒</p>
              <p className="text-base leading-5">重複9遍，共85秒</p>
            </div>
          </div>

          <div className="flex items-center gap-5 bg-[#343434] rounded-[16px] p-4">
            <div className="h-12 w-12 flex items-center justify-center">
              <button
                onClick={playWaveOffSound}
                className="cursor-pointer hover:opacity-70 transition-opacity"
                aria-label="播放解除警報音效"
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22 35.9502V31.8502C25 30.9835 27.4167 29.3169 29.25 26.8502C31.0833 24.3835 32 21.5835 32 18.4502C32 15.3169 31.0833 12.5169 29.25 10.0502C27.4167 7.58353 25 5.91686 22 5.0502V0.950195C26.1333 1.88353 29.5 3.9752 32.1 7.2252C34.7 10.4752 36 14.2169 36 18.4502C36 22.6835 34.7 26.4252 32.1 29.6752C29.5 32.9252 26.1333 35.0169 22 35.9502ZM0 24.5002V12.5002H8L18 2.5002V34.5002L8 24.5002H0ZM22 26.5002V10.4002C23.5667 11.1335 24.7917 12.2335 25.675 13.7002C26.5583 15.1669 27 16.7669 27 18.5002C27 20.2002 26.5583 21.7752 25.675 23.2252C24.7917 24.6752 23.5667 25.7669 22 26.5002ZM14 12.2002L9.7 16.5002H4V20.5002H9.7L14 24.8002V12.2002Z"
                    fill={isPlayingAlertOff ? '#F23555' : 'white'}
                    className="transition-colors"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 text-white">
              <p className="font-bold h-[25px]">解除警報</p>
              <p className="text-base leading-5">一長聲90秒</p>
            </div>
          </div>
        </div>

        <div className="text-[16px] leading-[20px] text-center text-white">
          如未聽到警報，請勿誤信錯誤訊息！
          <br />
          並請大家協助轉傳正確資訊
        </div>
      </div>
    </div>
  );
}

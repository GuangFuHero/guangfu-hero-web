import { useState, useEffect } from 'react';
import CarouselIndicators from './CarouselIndicators';
import { useDrag } from '@/hooks/useDrag';
import PrevButton from './PrevButton';
import NextButton from './NextButton';

interface AlertBannerProps {
  onAlertClick: () => void;
}

interface BannerAlert {
  text: string;
  actionable: boolean;
}

export default function AlertBanner({ onAlertClick }: AlertBannerProps) {
  const [alerts, setAlerts] = useState<BannerAlert[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // 手動互動或 hover 時暫停輪播

  useEffect(() => {
    async function fetchBanners() {
      try {
        // 直接從客戶端抓取 Google Sheets（避免伺服器端權限問題）
        const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
        if (!sheetId) {
          throw new Error('NEXT_PUBLIC_GOOGLE_SHEET_ID not configured');
        }

        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
        const response = await fetch(csvUrl);
        const csvText = await response.text();

        // 檢查是否返回 HTML
        if (csvText.includes('<!DOCTYPE') || csvText.includes('<html')) {
          throw new Error('Google Sheets not accessible');
        }

        const lines = csvText.trim().split('\n');
        const dataLines = lines.slice(1); // 跳過標題行

        const fetchedAlerts: BannerAlert[] = dataLines
          .map(line => {
            const [text, actionableStr] = line.split(',').map(s => s.trim());
            if (!text) return null;

            return {
              text: text
                .replace(/^"|"$/g, '') // 移除前後引號
                .replace(/\\n/g, '\n'), // 把 \n 轉換成真正的換行
              actionable: actionableStr?.toLowerCase() === 'true',
            };
          })
          .filter((alert): alert is BannerAlert => alert !== null);

        if (fetchedAlerts.length > 0) {
          setAlerts(fetchedAlerts);
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      }
    }

    fetchBanners();
  }, []);

  useEffect(() => {
    if (isPaused || alerts.length === 0) return; // 暫停時或沒有資料時不啟動計時器
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % alerts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused, alerts.length]);

  const next = () => setCurrentSlide(prev => (prev + 1) % alerts.length);
  const prev = () => setCurrentSlide(prev => (prev - 1 + alerts.length) % alerts.length);

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = e => {
    if (e.key === 'ArrowRight') {
      setIsPaused(true);
      next();
    } else if (e.key === 'ArrowLeft') {
      setIsPaused(true);
      prev();
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (currentInfo.actionable) {
        onAlertClick();
      }
    }
  };

  const { isDragging, dragHandlers } = useDrag({
    onSwipeLeft: next,
    onSwipeRight: prev,
    onDragStart: () => setIsPaused(true),
    onDragEnd: () => setIsPaused(false),
  });

  if (alerts.length === 0) {
    return (
      <>
        <div className="bg-[#FFEEBA] h-[64px]"></div>
        <div className="py-3 bg-white"></div>
      </>
    );
  }

  const currentInfo = alerts[currentSlide];

  return (
    <div>
      <div
        className={`bg-[#FFEEBA] h-[64px] flex items-center justify-center cursor-pointer hover:bg-[#FFE5A0] transition-colors ${
          currentInfo.actionable ? 'cursor-pointer hover:bg-[#FFE5A0]' : 'cursor-default'
        } ${isDragging ? 'select-none' : ''}`}
        onClick={() => currentInfo.actionable && onAlertClick()}
        role={currentInfo.actionable ? 'button' : undefined}
        aria-pressed={currentInfo.actionable ? false : undefined}
        aria-disabled={!currentInfo.actionable || undefined}
        aria-roledescription="carousel"
        aria-label="警示輪播"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        {...dragHandlers}
      >
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-full select-none">
          <PrevButton setIsPaused={setIsPaused} prev={prev} />
          <div className="flex-1 text-center text-[var(--text-black)] font-medium whitespace-pre-wrap">
            {currentInfo.text}
            {!currentInfo.actionable && <span className="sr-only">（此訊息不可點擊）</span>}
          </div>
          <NextButton setIsPaused={setIsPaused} next={next} />
        </div>
      </div>
      <CarouselIndicators
        alerts={alerts}
        setCurrentSlide={setCurrentSlide}
        setIsPaused={setIsPaused}
        currentSlide={currentSlide}
      />
    </div>
  );
}

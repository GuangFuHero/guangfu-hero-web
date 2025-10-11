'use client';

interface StepNumberProps {
  number: number;
}

export default function StepNumber({ number }: StepNumberProps) {
  return (
    <div className="flex items-center justify-center w-[30px] h-[30px] bg-[var(--primary)] rounded-full text-white text-md shrink-0">
      {number}
    </div>
  );
}

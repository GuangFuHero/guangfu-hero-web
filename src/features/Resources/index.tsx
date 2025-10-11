'use client';

export default function Resources() {
  return (
    <div className="w-full h-[calc(100vh-180px)]">
      <iframe
        src="https://pinkowo.github.io/hualien-bees/"
        className="w-full h-full border-0"
        title="物資媒合"
        allow="geolocation"
      />
    </div>
  );
}

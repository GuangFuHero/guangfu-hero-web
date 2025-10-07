"use client";

import Header from "@/features/Header";
import Footer from "@/features/Footer";

export default function VolunteerRegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <iframe
          src="https://hualien-volunteers-frontend-iota.vercel.app/"
          className="w-full border-0"
          title="志工媒合"
          allow="geolocation"
          style={{ height: "calc(100vh - 180px)" }}
        />
      </main>
      <Footer />
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import bgTop from "@/app/asset/bg-top.png";

export default function Home() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const startHandler = () => {
    router.push('/sake');
  };

  return (
    <div
      className={`w-screen h-screen flex flex-col justify-center items-center bg-cover transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      style={{ backgroundImage: `url(${bgTop.src})` }}
    >
      <h1 className="text-3xl mb-6 bg-gray-500 bg-opacity-50 p-8 rounded-md animate-fade-in font-shizuru text-6xl text-white">
        旅酒
      </h1>
      <button
        className="px-6 py-3 bg-gradient-to-r from-yellow-300 to-yellow-500 text-black font-semibold rounded-full border border-yellow-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        onClick={startHandler}
      >
        始める
      </button>
    </div>
  );
}

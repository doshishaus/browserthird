"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import bgTop from "@/app/asset/bg-top.png";

interface Prefecture {
  地域名称: string;
  人数: number;
}

const fetchCSVData = async (): Promise<Prefecture[]> => {
  try {
    const response = await fetch('/json/pre.csv');
    if (!response.ok) {
      throw new Error(`pre.csvのフェッチに失敗しました: ${response.statusText}`);
    }
    const csvText = await response.text();
    return new Promise((resolve, reject) => {
      Papa.parse<Prefecture>(csvText, {
        header: true,
        complete: (results) => {
          if (results.errors.length) {
            console.error('CSVのパースエラー:', results.errors);
            reject(results.errors);
          } else {
            console.log('CSVのパース結果:', results.data); // デバッグログ
            resolve(results.data);
          }
        },
        error: (error: Error) => { // 型を指定
          console.error('CSVのパース中のエラー:', error); // エラーログ
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('CSVのフェッチ中のエラー:', error); // エラーログ
    throw error;
  }
};

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
      <h1 className="text-5xl font-bold text-white mb-6 bg-gray-800 bg-opacity-75 p-4 rounded-lg border-4 border-yellow-500 shadow-lg animate-fade-in font-shizuru transform transition-transform duration-300 hover:scale-110 hover:shadow-2xl">
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

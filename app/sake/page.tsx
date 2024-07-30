"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

interface Prefecture {
  地域名称: string;
  人数: number;
}

interface Sake {
  brand: string;
  type: string;
  mariage: string;
  matchDrinkingSceneAndTarget: string;
  description: string;
}

const fetchCSVData = async (): Promise<Prefecture[]> => {
  try {
    const response = await fetch('/json/pre.csv');
    if (!response.ok) {
      throw new Error(`pre.csvのフェッチに失敗しました: ${response.statusText}`);
    }
    const csvText = await response.text();
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
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
        error: (error) => {
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

const fetchBottlesData = async () => {
  try {
    const response = await fetch('/json/bottles.json');
    if (!response.ok) {
      throw new Error(`bottles.jsonのフェッチに失敗しました: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('bottles.jsonのデータ:', data); // デバッグログ
    return data;
  } catch (error) {
    console.error('bottles.jsonのフェッチ中のエラー:', error); // エラーログ
    throw error;
  }
};

const fetchSakeData = async (filePath: string): Promise<Sake[]> => {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`${filePath}のフェッチに失敗しました: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`${filePath}からの日本酒データ:`, data); // デバッグログ
    return data;
  } catch (error) {
    console.error(`${filePath}からの日本酒データのフェッチ中のエラー:`, error); // エラーログ
    throw error;
  }
};

const SakePage = () => {
  const [prefectureRanking, setPrefectureRanking] = useState<Prefecture[]>([]);
  const [bottlesMapping, setBottlesMapping] = useState({});
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);
  const [filteredSake, setFilteredSake] = useState<Sake[]>([]);
  const [selectedSake, setSelectedSake] = useState<Sake | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationOrigin, setAnimationOrigin] = useState({ top: '50%', left: '50%' });
  const [closeAnimation, setCloseAnimation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [csvData, bottlesData] = await Promise.all([fetchCSVData(), fetchBottlesData()]);
        setPrefectureRanking(csvData);
        setBottlesMapping(bottlesData);
      } catch (error) {
        console.error('データの読み込み中にエラーが発生しました:', error); // エラーログ
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedPrefecture && bottlesMapping[selectedPrefecture]) {
      const loadSakeData = async () => {
        try {
          const sakeData = await fetchSakeData(`/json/bottles/${bottlesMapping[selectedPrefecture]}`);
          setFilteredSake(sakeData);
        } catch (error) {
          console.error('日本酒データの読み込み中にエラーが発生しました:', error); // エラーログ
        }
      };
      loadSakeData();
    }
  }, [selectedPrefecture, bottlesMapping]);

  const handlePrefectureClick = (prefecture: string) => {
    setSelectedPrefecture(prefecture);
    setIsAnimating(true);
    setCloseAnimation(false);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleSakeClick = (sake: Sake) => {
    setSelectedSake(sake);
  };

  const handleClosePopup = () => {
    setTimeout(() => {
      setSelectedSake(null);
      setCloseAnimation(false);
    }, 300);
  };

  const handleClosePrefecturePopup = () => {
    setCloseAnimation(true);
    setTimeout(() => {
      setSelectedPrefecture(null);
      setFilteredSake([]);
      setCloseAnimation(false);
    }, 300);
  };

  const getRankClass = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-yellow-300 border-yellow-400 text-yellow-800';
      case 1:
        return 'bg-gray-300 border-gray-400 text-gray-800';
      case 2:
        return 'bg-orange-300 border-orange-400 text-orange-800';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  // カスタム矢印コンポーネント
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} text-black bg-white rounded-full shadow-lg p-2`}
        style={{ ...style, display: "block", right: 10 }}
        onClick={onClick}
      >
        &gt;
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={`${className} text-black bg-white rounded-full shadow-lg p-2`}
        style={{ ...style, display: "block", left: 10, zIndex: 1 }}
        onClick={onClick}
      >
        &lt;
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">観光人気順都道府県ランキング</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prefectureRanking.length > 0 ? (
          prefectureRanking.map((pref, index) => (
            <div
              key={pref.地域名称}
              onClick={() => handlePrefectureClick(pref.地域名称)}
              className={`cursor-pointer p-4 hover:bg-blue-50 rounded-lg shadow-md border transform hover:scale-105 transition-transform duration-200 ${getRankClass(index)}`}
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold">{index + 1}</div>
                <div className="text-xl">{pref.地域名称}</div>
              </div>
            </div>
          ))
        ) : (
          <div>ランキングデータを読み込んでいます...</div>
        )}
      </div>

      

      {selectedPrefecture && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isAnimating || closeAnimation ? 'animate-popup' : ''}`}
          style={{
            transformOrigin: '50% 50%',
            transform: isAnimating || closeAnimation ? 'scale(0)' : 'scale(1)',
            transition: 'transform 0.3s ease-out'
          }}
        >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2">

                    <h2 className="text-2xl font-semibold mb-4 text-center">{selectedPrefecture}で生産されている日本酒</h2>
            <Slider {...settings}>
              {filteredSake.length > 0 ? (
                Array.from({ length: Math.ceil(filteredSake.length / 6) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                      {filteredSake.slice(slideIndex * 6, (slideIndex + 1) * 6).map((sake, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white rounded-lg shadow-md border border-gray-200 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSakeClick(sake)}
                        >
                          {sake.brand}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div>日本酒データを読み込んでいます...</div>
              )}
            </Slider>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={handleClosePrefecturePopup}
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {selectedSake && (
        <div
          className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isAnimating || closeAnimation ? 'animate-popup' : ''}`}
          style={{
            transformOrigin: '50% 50%',
            transform: isAnimating || closeAnimation ? 'scale(0)' : 'scale(1)',
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
            <h2 className="text-2xl font-bold mb-4">{selectedSake.brand}</h2>
            <p><strong>種類:</strong> {selectedSake.type}</p>
            <p><strong>マリアージュ:</strong> {selectedSake.mariage}</p>
            <p><strong>飲用シーンと対象:</strong> {selectedSake.matchDrinkingSceneAndTarget}</p>
            <p><strong>説明:</strong> {selectedSake.description}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              onClick={handleClosePopup}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SakePage;

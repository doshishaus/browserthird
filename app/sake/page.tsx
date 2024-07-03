"use client"
import { useEffect, useState } from 'react';
import { Bottle, BestDrinkData } from '../types'; // 型定義をインポート
import { throws } from 'assert';

interface DrinkingAmount {
  エタノール量: string;
  日本酒の量: string;
}

interface OptimalAmounts {
  男性: { [key: string]: DrinkingAmount };
  女性: { [key: string]: DrinkingAmount };
}

export default function Sake() {
  const [bottles, setBottles] = useState<Bottle[] | null>(null);
  const [bestDrinkData, setBestDrinkData] = useState<BestDrinkData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prefectures = [
      'hokkaido', 'aomori', 'iwate', 'miyagi', 'akita', 'yamagata', 'fukushima',
      'ibaraki', 'tochigi', 'gunma', 'saitama', 'chiba', 'tokyo', 'kanagawa',
      'niigata', 'toyama', 'ishikawa', 'fukui', 'yamanashi', 'nagano', 'gifu',
      'shizuoka', 'aichi', 'mie', 'shiga', 'kyoto', 'osaka', 'hyogo', 'nara', 'wakayama',
      'tottori', 'shimane', 'okayama', 'hiroshima', 'yamaguchi',
      'tokushima', 'kagawa', 'ehime', 'kochi',
      'fukuoka', 'saga', 'nagasaki', 'kumamoto', 'oita', 'miyazaki', 'kagoshima', 'okinawa'
    ];
    // aichi.jsonをフェッチして状態にセット
    const fetchBottleData = async () => {
      try {
        const promises = prefectures.map(prefectures =>
          fetch(`/json/bottles/${prefectures}.json`)
            .then(res => {
              if (!res.ok) {
                throw new Error(`HTTPがエラー起こした！! status: ${res.status}`);
              }
              return res.json();
            })
        );
        const results = await Promise.all(promises);
        const allBottles = results.flat();
        setBottles(allBottles);
      } catch (err) {
        setError(err.message);
      }
    };
    const fetchBestDrinkData = async () => {
      try {
        const res = await fetch("/json/bestDrinkData.json");
        if (!res.ok) {
          throw new Error(`HTTPのエラー！${res.status}`);
        }
        const data: BestDrinkData = await res.json();
        setBestDrinkData(data);
      } catch (err) {
        setError(err.message);
      }
    };
      fetchBottleData();
      fetchBestDrinkData();
    }, []);

  const parseAlcoholContent = (content: string): number | null => {
    if (!content) return null;
    const range = content.split('～');
    if (range.length === 2) {
      const avg = (parseFloat(range[0]) + parseFloat(range[1])) / 2;
      return avg;
    }
    return parseFloat(content);
  };

  const calculateBestDrinkAmount = (alcoholContent: number): OptimalAmounts | null => {
    if (!bestDrinkData) return null;
    const results: OptimalAmounts = { "男性": {}, "女性": {} };
    Object.keys(bestDrinkData["男性"]).forEach(weight => {
      const maleEthanol = bestDrinkData["男性"][weight];
      const femaleEthanol = bestDrinkData["女性"][weight];
      results["男性"][weight] = {
        "エタノール量": `${maleEthanol}g`,
        "日本酒の量": `${(maleEthanol / (alcoholContent * 0.8 / 100)).toFixed(2)}ml`
      };
      results["女性"][weight] = {
        "エタノール量": `${femaleEthanol}g`,
        "日本酒の量": `${(femaleEthanol / (alcoholContent * 0.8 / 100)).toFixed(2)}ml`
      };
    });
    return results;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!bottles || !bestDrinkData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Sake Bottles Data (Aichi)</h1>
      {bottles.map((bottle, index) => {
        const alcoholContent = parseAlcoholContent(bottle.alcoholContent);
        if (alcoholContent === null) return null;

        const optimalAmounts = calculateBestDrinkAmount(alcoholContent);

        return (
          <div key={index}>
            <h2>{bottle.brand}</h2>
            <p>{bottle.subname}</p>
            <p>Alcohol Content: {alcoholContent}%</p>
            <div>
              <h3>適正飲酒量</h3>
              <h4>男性</h4>
              {optimalAmounts && Object.keys(optimalAmounts["男性"]).map(weight => (
                <div key={weight}>
                  <p>{weight} - エタノール量: {optimalAmounts["男性"][weight]["エタノール量"]}, 日本酒の量: {optimalAmounts["男性"][weight]["日本酒の量"]}</p>
                </div>
              ))}
              <h4>女性</h4>
              {optimalAmounts && Object.keys(optimalAmounts["女性"]).map(weight => (
                <div key={weight}>
                  <p>{weight} - エタノール量: {optimalAmounts["女性"][weight]["エタノール量"]}, 日本酒の量: {optimalAmounts["女性"][weight]["日本酒の量"]}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

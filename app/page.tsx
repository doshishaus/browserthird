import Image from "next/image";
import Link from "next/link";
import sake from "./sake/page";

export default function Home() {
  return (
    <div className="w-screen h-screen text-center">
      <h1>杉下温音オリジナルブラウザ</h1>
      <p>男性はこちら</p>
      <p>女性はこちら</p>
      <Link href="/sake">クリック</Link>
    </div>
  );
}
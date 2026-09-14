import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TopBar({ title }: { title: string }) {
  return (
    <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-b-3xl shadow-md flex items-center gap-4 mb-6 sticky top-0 z-40">
      <Link href="/" className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors active:scale-95 shrink-0">
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <h1 className="text-xl font-bold line-clamp-1">{title}</h1>
    </div>
  );
}

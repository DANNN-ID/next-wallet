import Link from "next/link";
import TopBar from "@/components/TopBar";
import CategoryForm from "./CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-24">
      <TopBar title="Kategori Baru" />

      <div className="px-4">
        <CategoryForm />
      </div>
    </div>
  );
}

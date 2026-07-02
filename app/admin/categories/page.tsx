import CategoryManager from "@/components/admin/CategoryManager";
import { getRepository } from "@/lib/db/repository";

export default async function AdminCategoriesPage() {
  const initialCategories = await getRepository().getAllCategories();
  return <CategoryManager initialCategories={initialCategories} />;
}

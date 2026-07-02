import StoreManager from "@/components/admin/StoreManager";
import { getRepository } from "@/lib/db/repository";

export default async function AdminStoresPage() {
  const repo = getRepository();
  const [initialStores, initialCategories] = await Promise.all([
    repo.getAllStores(),
    repo.getAllCategories(),
  ]);

  return (
    <StoreManager initialStores={initialStores} initialCategories={initialCategories} />
  );
}

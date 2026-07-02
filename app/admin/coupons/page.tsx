import CouponManager from "@/components/admin/CouponManager";
import { getRepository } from "@/lib/db/repository";

export default async function AdminCouponsPage() {
  const repo = getRepository();
  const [initialCoupons, initialStores] = await Promise.all([
    repo.getAllCoupons(),
    repo.getAllStores(),
  ]);

  return (
    <CouponManager initialCoupons={initialCoupons} initialStores={initialStores} />
  );
}

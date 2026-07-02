import CouponModalProvider, {
  type InitialCouponModal,
} from "@/components/coupons/CouponModalProvider";
import SiteLayoutShell from "@/components/layout/SiteLayoutShell";

interface SiteLayoutProps {
  children: React.ReactNode;
  initialCouponModal?: InitialCouponModal | null;
}

export default function SiteLayout({
  children,
  initialCouponModal = null,
}: SiteLayoutProps) {
  return (
    <CouponModalProvider initialCouponModal={initialCouponModal}>
      <SiteLayoutShell>{children}</SiteLayoutShell>
    </CouponModalProvider>
  );
}

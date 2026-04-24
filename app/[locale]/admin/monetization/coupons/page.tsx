import { createClient } from "@/lib/supabase/server";
import { CouponManagementClient } from "@/components/admin/CouponManagementClient";

export default async function CouponManagement() {
  const supabase = await createClient();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  return <CouponManagementClient initialCoupons={coupons || []} />;
}

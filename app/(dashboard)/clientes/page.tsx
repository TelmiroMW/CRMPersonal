import { createClient } from "@/lib/supabase/server";
import { ClientesList } from "@/components/ClientesList";

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clients")
    .select("*, projects(*)")
    .order("name", { ascending: true });

  return <ClientesList clients={(data as any) ?? []} />;
}

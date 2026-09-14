import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectDetail } from "@/components/ProjectDetail";

export default async function ProyectoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).single();
  if (!project) notFound();

  const { data: client } = await supabase
    .from("clients")
    .select("name")
    .eq("id", project.client_id)
    .single();

  const { data: phases } = await supabase
    .from("phases")
    .select("*")
    .eq("project_id", id)
    .order("order_index", { ascending: true });

  return <ProjectDetail project={project} clientName={client?.name ?? ""} phases={phases ?? []} />;
}

import { notFound } from "next/navigation";
import { getDocumentWithPath } from "@/lib/catalog";
import ReaderShell from "@/components/reader/ReaderShell";
import ViewerGuard from "@/components/reader/ViewerGuard";
import "../../viewer.css";

export const dynamic = "force-dynamic";

export default async function ViewerPage({ params }: { params: Promise<{ id: string[] }> }) {
  const { id } = await params;
  const doc = await getDocumentWithPath(id);

  if (!doc) notFound();

  return (
    <ViewerGuard>
      <ReaderShell doc={doc} />
    </ViewerGuard>
  );
}

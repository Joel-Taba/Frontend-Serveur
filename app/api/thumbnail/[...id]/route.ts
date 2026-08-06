import { NextResponse } from "next/server";
import { getDocumentWithPath } from "@/lib/catalog";

export const dynamic = "force-dynamic";

// Relaie vers la miniature générée par le Backend (Backend/apps/library/thumbnails.py) —
// même page passée en paramètre pour les vignettes de pages PDF de la barre latérale.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string[] }> }
) {
  const { id } = await params;
  const doc = await getDocumentWithPath(id);

  if (!doc) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  const page = new URL(request.url).searchParams.get("page");
  const url = page ? `${doc.thumbnailUrl}?page=${encodeURIComponent(page)}` : doc.thumbnailUrl;

  const backendResponse = await fetch(url, { cache: "no-store" });
  if (!backendResponse.ok) {
    return NextResponse.json({ error: "Aucune miniature disponible" }, { status: backendResponse.status });
  }

  return new NextResponse(backendResponse.body, {
    status: 200,
    headers: {
      "Content-Type": backendResponse.headers.get("content-type") ?? "image/png",
      "Cache-Control": backendResponse.headers.get("cache-control") ?? "public, max-age=31536000, immutable",
    },
  });
}

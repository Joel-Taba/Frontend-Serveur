import { NextResponse } from "next/server";
import { getDocumentWithPath } from "@/lib/catalog";

export const dynamic = "force-dynamic";

const FORWARDED_HEADERS = [
  "content-type",
  "content-length",
  "content-range",
  "content-disposition",
  "accept-ranges",
  "cache-control",
  "x-content-type-options",
];

// pdf.js charge les documents par plages d'octets : cette route relaie donc
// l'en-tête Range vers le Backend (Django) et retransmet sa réponse
// (206 Partial Content compris) telle quelle, sans jamais toucher au disque
// local — le fichier réel vit désormais dans Backend/media/.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string[] }> }
) {
  const { id } = await params;
  const doc = await getDocumentWithPath(id);

  if (!doc) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  const range = request.headers.get("range");
  const authorization = request.headers.get("authorization");
  const outgoingHeaders: HeadersInit = {};
  if (range) outgoingHeaders.Range = range;
  if (authorization) outgoingHeaders.Authorization = authorization;

  const backendResponse = await fetch(doc.downloadUrl, {
    headers: outgoingHeaders,
    cache: "no-store",
  });

  if (!backendResponse.ok && backendResponse.status !== 206) {
    if (backendResponse.status === 401) {
      return NextResponse.json({ error: "Connexion requise pour consulter ce document" }, { status: 401 });
    }
    return NextResponse.json({ error: "Document introuvable" }, { status: backendResponse.status });
  }

  const headers = new Headers();
  for (const key of FORWARDED_HEADERS) {
    const value = backendResponse.headers.get(key);
    if (value) headers.set(key, value);
  }

  return new NextResponse(backendResponse.body, { status: backendResponse.status, headers });
}

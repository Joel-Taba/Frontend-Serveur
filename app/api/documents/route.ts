import { NextResponse } from "next/server";
import { getCatalogTree } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { tree: await getCatalogTree() },
    { headers: { "Cache-Control": "no-store" } }
  );
}

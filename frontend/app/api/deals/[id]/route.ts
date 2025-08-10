import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE || "http://localhost:5214";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const res = await fetch(`${API_BASE}/deals/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}


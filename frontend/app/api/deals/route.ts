import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE || "http://localhost:5214";

export async function GET() {
  const res = await fetch(`${API_BASE}/deals`);
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${API_BASE}/deals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}


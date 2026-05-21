import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// GET — public, used by estimator
export async function GET() {
  try {
    const rows = await sql`SELECT service, config FROM pricing`;
    const pricing: Record<string, unknown> = {};
    rows.forEach((row) => {
      pricing[row.service] = row.config;
    });
    return NextResponse.json(pricing);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch pricing" },
      { status: 500 }
    );
  }
}

// POST — admin only, update pricing
export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const { service, config } = await req.json();

    await sql`
      UPDATE pricing
      SET config = ${JSON.stringify(config)}, updated_at = NOW()
      WHERE service = ${service}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update pricing" },
      { status: 500 }
    );
  }
}
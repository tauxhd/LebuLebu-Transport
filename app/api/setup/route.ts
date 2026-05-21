import { setupDatabase } from "@/lib/setup-db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await setupDatabase();
    return NextResponse.json({ success: true, message: "Database ready" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
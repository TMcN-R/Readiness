import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const count = await prisma.organisation.count();
    return NextResponse.json({ ok: true, organisationCount: count });
  } catch (err) {
    const error = err as Error & { code?: string; meta?: unknown };
    return NextResponse.json(
      {
        ok: false,
        name: error.name,
        message: error.message,
        code: error.code,
        meta: error.meta,
        stack: error.stack,
        databaseUrlPresent: Boolean(process.env.DATABASE_URL),
        databaseUrlPrefix: process.env.DATABASE_URL?.slice(0, 20),
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { getOrganisationByToken } from "@/app/lib/data";

const bodySchema = z.object({
  questionId: z.string(),
  answer: z.enum(["NONE", "AD_HOC", "PARTIAL", "FORMAL", "EMBEDDED", "NA"]),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const org = await getOrganisationByToken(token);
  if (!org) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { questionId, answer } = parsed.data;

  await prisma.response.upsert({
    where: { organisationId_questionId: { organisationId: org.id, questionId } },
    update: { answer },
    create: { organisationId: org.id, questionId, answer },
  });

  if (org.status === "NOT_STARTED") {
    await prisma.organisation.update({
      where: { id: org.id },
      data: { status: "IN_PROGRESS" },
    });
  }

  return NextResponse.json({ ok: true });
}

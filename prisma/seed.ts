import "dotenv/config";
import { PrismaClient, Section } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type SeedQuestion = { order: number; section: Section; text: string };

const questions: SeedQuestion[] = [
  { order: 1, section: "GOVERNANCE", text: "How clearly defined is leadership accountability for risk, security, and crisis management?" },
  { order: 2, section: "GOVERNANCE", text: "To what extent is senior management actively engaged in risk and security oversight?" },
  { order: 3, section: "GOVERNANCE", text: "How well integrated are risk and security considerations into organisational decision-making?" },
  { order: 4, section: "GOVERNANCE", text: "To what extent are roles and responsibilities for risk and security clearly defined across the organisation?" },
  { order: 5, section: "GOVERNANCE", text: "How effectively are resources allocated to risk, security, and resilience functions?" },
  { order: 6, section: "RISK", text: "How developed and consistently applied is your organisation-wide risk assessment process?" },
  { order: 7, section: "RISK", text: "How well defined and standardised is your risk assessment methodology?" },
  { order: 8, section: "RISK", text: "How frequently are risk assessments conducted and updated?" },
  { order: 9, section: "RISK", text: "How comprehensive and current is your risk register?" },
  { order: 10, section: "RISK", text: "To what extent is the risk register actively used in decision-making?" },
  { order: 11, section: "RISK", text: "How clearly are risk owners assigned and held accountable?" },
  { order: 12, section: "RISK", text: "How systematically are risks monitored and reviewed over time?" },
  { order: 13, section: "SECURITY", text: "Does your organisation have a designated person responsible for security management? (This role may also cover risk management.)" },
  { order: 14, section: "SECURITY", text: "How comprehensive and implemented is your organisation-wide security policy?" },
  { order: 15, section: "SECURITY", text: "How well developed are country or site-specific security plans?" },
  { order: 16, section: "SECURITY", text: "How regularly are security plans reviewed and updated?" },
  { order: 17, section: "SECURITY", text: "How effectively are security risks assessed at the field level?" },
  { order: 18, section: "SECURITY", text: "How robust are access controls and physical security measures across locations?" },
  { order: 19, section: "SECURITY", text: "How developed are journey management procedures?" },
  { order: 20, section: "SECURITY", text: "How effective are communication systems for staff safety and security?" },
  { order: 21, section: "SECURITY", text: "How well defined and understood are incident reporting procedures?" },
  { order: 22, section: "SECURITY", text: "How consistently are security incidents reported?" },
  { order: 23, section: "SECURITY", text: "How effectively are security incidents analysed and acted upon?" },
  { order: 24, section: "SECURITY", text: "How effectively does the organisation monitor and adapt to changes in the operating environment and threat context?" },
  { order: 25, section: "CRISIS", text: "Does your organisation have a designated person with lead responsibility for crisis management?" },
  { order: 26, section: "CRISIS", text: "How developed and operational is your crisis management framework (plans, structures, processes)?" },
  { order: 27, section: "CRISIS", text: "How clearly defined is your crisis management team structure?" },
  { order: 28, section: "CRISIS", text: "How well documented and understood are crisis roles and responsibilities?" },
  { order: 29, section: "CRISIS", text: "To what extent is a 24/7 escalation and decision-making structure in place?" },
  { order: 30, section: "CRISIS", text: "How effective are crisis communications processes (internal and external)?" },
  { order: 31, section: "CRISIS", text: "How regularly are crisis management plans tested or exercised?" },
  { order: 32, section: "CRISIS", text: "How effectively are lessons from exercises incorporated into improvements?" },
  { order: 33, section: "CRISIS", text: "How effective is decision-making during crisis situations, including clarity, speed, and authority?" },
  { order: 34, section: "BCP", text: "Does your organisation have a designated person responsible for business continuity planning?" },
  { order: 35, section: "BCP", text: "How developed and operational is your business continuity planning framework?" },
  { order: 36, section: "BCP", text: "How well identified are critical functions, dependencies and points of failure?" },
  { order: 37, section: "BCP", text: "How clearly defined are recovery priorities and timelines?" },
  { order: 38, section: "BCP", text: "How robust are recovery strategies for key operational disruptions?" },
  { order: 39, section: "BCP", text: "How regularly is business continuity capability tested?" },
  { order: 40, section: "BCP", text: "How effectively are BCP lessons integrated into planning?" },
  { order: 41, section: "PEOPLE", text: "How systematically are staff trained in security awareness and field safety?" },
  { order: 42, section: "PEOPLE", text: "How systematically are staff trained in first aid?" },
  { order: 43, section: "PEOPLE", text: "How appropriate is training for different roles and risk exposure levels?" },
  { order: 44, section: "PEOPLE", text: "How effectively are managers trained in crisis and incident response?" },
  { order: 45, section: "PEOPLE", text: "How consistently is training refreshed or updated?" },
  { order: 46, section: "PEOPLE", text: "How well prepared are staff for deployment into higher-risk environments?" },
  { order: 47, section: "PEOPLE", text: "How well defined and implemented are duty of care and safeguarding responsibilities?" },
  { order: 48, section: "OPERATIONS", text: "How comprehensive and consistently applied are standard operating procedures (SOPs)?" },
  { order: 49, section: "OPERATIONS", text: "How well are pre-deployment briefings conducted and tailored to context?" },
  { order: 50, section: "OPERATIONS", text: "How effectively are field activities supervised and managed?" },
  { order: 51, section: "OPERATIONS", text: "How consistent are operational practices across countries and sites?" },
  { order: 52, section: "OPERATIONS", text: "How well are remote or isolated work activities managed?" },
  { order: 53, section: "OPERATIONS", text: "How effectively are movement, transport, and logistics managed in higher-risk environments?" },
  { order: 54, section: "ASSURANCE", text: "How systematically are policies, plans, and procedures reviewed?" },
  { order: 55, section: "ASSURANCE", text: "How effectively are audits or internal reviews conducted?" },
  { order: 56, section: "ASSURANCE", text: "How well are lessons from incidents captured?" },
  { order: 57, section: "ASSURANCE", text: "How consistently are lessons learned integrated into practice?" },
  { order: 58, section: "ASSURANCE", text: "How effectively does the organisation adapt its systems based on emerging risks?" },
];

async function main() {
  // Match existing rows by their unchanging text (not order, since inserting
  // new questions mid-list shifts the order of every question after them).
  // This keeps the same Question.id - and any Responses already linked to it -
  // intact; only genuinely new questions get a fresh row.
  const existing = await prisma.question.findMany();
  const existingByText = new Map(existing.map((q) => [q.text, q]));

  const toReorder = questions
    .map((q) => ({ target: q, match: existingByText.get(q.text) }))
    .filter(
      (x) => x.match && (x.match.order !== x.target.order || x.match.section !== x.target.section)
    ) as { target: SeedQuestion; match: NonNullable<ReturnType<typeof existingByText.get>> }[];

  // `order` is unique, so shifting existing rows directly to their new order
  // can collide with whatever currently occupies that slot. Move them all to
  // a temporary out-of-range order first, then to their final order - by then
  // every slot has been vacated.
  const TEMP_OFFSET = 10000;
  for (const { match } of toReorder) {
    await prisma.question.update({
      where: { id: match.id },
      data: { order: match.order + TEMP_OFFSET },
    });
  }
  for (const { target, match } of toReorder) {
    await prisma.question.update({
      where: { id: match.id },
      data: { order: target.order, section: target.section },
    });
  }

  let created = 0;
  for (const q of questions) {
    if (!existingByText.has(q.text)) {
      await prisma.question.create({ data: q });
      created++;
    }
  }

  console.log(
    `Seeded ${questions.length} questions (${created} created, ${toReorder.length} reordered).`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

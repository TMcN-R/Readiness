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
  { order: 13, section: "SECURITY", text: "How comprehensive and implemented is your organisation-wide security policy?" },
  { order: 14, section: "SECURITY", text: "How well developed are country or site-specific security plans?" },
  { order: 15, section: "SECURITY", text: "How regularly are security plans reviewed and updated?" },
  { order: 16, section: "SECURITY", text: "How effectively are security risks assessed at the field level?" },
  { order: 17, section: "SECURITY", text: "How robust are access controls and physical security measures across locations?" },
  { order: 18, section: "SECURITY", text: "How developed are journey management procedures?" },
  { order: 19, section: "SECURITY", text: "How effective are communication systems for staff safety and security?" },
  { order: 20, section: "SECURITY", text: "How well defined and understood are incident reporting procedures?" },
  { order: 21, section: "SECURITY", text: "How consistently are security incidents reported?" },
  { order: 22, section: "SECURITY", text: "How effectively are security incidents analysed and acted upon?" },
  { order: 23, section: "SECURITY", text: "How effectively does the organisation monitor and adapt to changes in the operating environment and threat context?" },
  { order: 24, section: "CRISIS", text: "How developed and operational is your crisis management framework (plans, structures, processes)?" },
  { order: 25, section: "CRISIS", text: "How clearly defined is your crisis management team structure?" },
  { order: 26, section: "CRISIS", text: "How well documented and understood are crisis roles and responsibilities?" },
  { order: 27, section: "CRISIS", text: "To what extent is a 24/7 escalation and decision-making structure in place?" },
  { order: 28, section: "CRISIS", text: "How effective are crisis communications processes (internal and external)?" },
  { order: 29, section: "CRISIS", text: "How regularly are crisis management plans tested or exercised?" },
  { order: 30, section: "CRISIS", text: "How effectively are lessons from exercises incorporated into improvements?" },
  { order: 31, section: "CRISIS", text: "How effective is decision-making during crisis situations, including clarity, speed, and authority?" },
  { order: 32, section: "BCP", text: "How developed and operational is your business continuity planning framework?" },
  { order: 33, section: "BCP", text: "How well identified are critical functions, dependencies and points of failure?" },
  { order: 34, section: "BCP", text: "How clearly defined are recovery priorities and timelines?" },
  { order: 35, section: "BCP", text: "How robust are recovery strategies for key operational disruptions?" },
  { order: 36, section: "BCP", text: "How regularly is business continuity capability tested?" },
  { order: 37, section: "BCP", text: "How effectively are BCP lessons integrated into planning?" },
  { order: 38, section: "PEOPLE", text: "How systematically are staff trained in security awareness and field safety?" },
  { order: 39, section: "PEOPLE", text: "How systematically are staff trained in first aid?" },
  { order: 40, section: "PEOPLE", text: "How appropriate is training for different roles and risk exposure levels?" },
  { order: 41, section: "PEOPLE", text: "How effectively are managers trained in crisis and incident response?" },
  { order: 42, section: "PEOPLE", text: "How consistently is training refreshed or updated?" },
  { order: 43, section: "PEOPLE", text: "How well prepared are staff for deployment into higher-risk environments?" },
  { order: 44, section: "PEOPLE", text: "How well defined and implemented are duty of care and safeguarding responsibilities?" },
  { order: 45, section: "OPERATIONS", text: "How comprehensive and consistently applied are standard operating procedures (SOPs)?" },
  { order: 46, section: "OPERATIONS", text: "How well are pre-deployment briefings conducted and tailored to context?" },
  { order: 47, section: "OPERATIONS", text: "How effectively are field activities supervised and managed?" },
  { order: 48, section: "OPERATIONS", text: "How consistent are operational practices across countries and sites?" },
  { order: 49, section: "OPERATIONS", text: "How well are remote or isolated work activities managed?" },
  { order: 50, section: "OPERATIONS", text: "How effectively are movement, transport, and logistics managed in higher-risk environments?" },
  { order: 51, section: "ASSURANCE", text: "How systematically are policies, plans, and procedures reviewed?" },
  { order: 52, section: "ASSURANCE", text: "How effectively are audits or internal reviews conducted?" },
  { order: 53, section: "ASSURANCE", text: "How well are lessons from incidents captured?" },
  { order: 54, section: "ASSURANCE", text: "How consistently are lessons learned integrated into practice?" },
  { order: 55, section: "ASSURANCE", text: "How effectively does the organisation adapt its systems based on emerging risks?" },
];

async function main() {
  for (const q of questions) {
    await prisma.question.upsert({
      where: { order: q.order },
      update: { section: q.section, text: q.text },
      create: q,
    });
  }
  console.log(`Seeded ${questions.length} questions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

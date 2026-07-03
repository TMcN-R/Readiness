import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <Image
        src="/maravi-logo.png"
        alt="Maravi Group"
        width={220}
        height={51}
        priority
        className="mb-8"
      />
      <h1 className="max-w-xl text-2xl font-semibold text-zinc-900">
        ORRA Field Readiness Tool
      </h1>
      <p className="mt-4 max-w-md text-zinc-600">
        This tool helps NGOs and charities operating in Africa assess their
        readiness to manage risk, security, and resilience in their
        operating context.
      </p>
      <p className="mt-4 max-w-md text-sm text-zinc-500">
        Clients access their assessment via a private link provided by their
        Maravi consultant.
      </p>
    </main>
  );
}

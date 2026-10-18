import { Suspense } from "react";
import districts from "@/data/districts.json";
import type { DistrictInfo } from "@/lib/types";

// tells Next.js the 25 district pages that exist, so they are built ahead of time
export function generateStaticParams() {
  return (districts as DistrictInfo[]).map((d) => ({ id: d.id }));
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="p-6">District page for: {id}</div>;
}

export default function DistrictPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <Content params={params} />
    </Suspense>
  );
}

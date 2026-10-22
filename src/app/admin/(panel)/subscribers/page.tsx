import { query } from "@/lib/db";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Subscribers() {
  const rows = await query<{ id: number; email: string; created_at: Date }>("select * from subscribers order by created_at desc limit 500");
  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Newsletter subscribers</h1>
      <p className="mt-1 text-sm text-mute">{rows.length} {rows.length === 1 ? "person has" : "people have"} signed up from the storefront.</p>
      <div className="panel mt-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr><th className="th">Email</th><th className="th">Joined</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td className="td text-mute" colSpan={2}>No subscribers yet.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}><td className="td">{r.email}</td><td className="td">{fmtDate(r.created_at)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

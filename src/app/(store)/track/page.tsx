import TrackForm from "@/components/TrackForm";

export const metadata = { title: "Track your order | Kadai & Co." };

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Track your order</h1>
      <p className="mt-3 text-mute">Enter the order number from your confirmation and the email you used at checkout.</p>
      <div className="mt-8"><TrackForm /></div>
    </div>
  );
}

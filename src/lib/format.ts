const inrFmt = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const inr = (n: number) => inrFmt.format(n);

export const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const invoiceNo = (id: number) => `INV-${String(id).padStart(5, "0")}`;

export const tileColor: Record<string, string> = {
  "Coffee & Tea": "#E7D5BF",
  Spices: "#F3C9B8",
  "Rice & Grains": "#E9E3B5",
  Snacks: "#F6DE9A",
  Kitchenware: "#BFD4E6",
};

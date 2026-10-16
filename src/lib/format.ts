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
  "Coffee & Tea": "#EFE3CF",
  Spices: "#F2DACB",
  "Rice & Grains": "#EAE6CC",
  Snacks: "#F2E6C6",
  Kitchenware: "#DCE5D8",
};

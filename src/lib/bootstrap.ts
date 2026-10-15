import type { Pool, PoolClient } from "pg";

const SCHEMA = `
create table if not exists meta (key text primary key, value text not null);

create table if not exists products (
  id serial primary key,
  name text not null,
  category text not null,
  description text not null default '',
  price integer not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  reorder_level integer not null default 10,
  emoji text not null default '📦',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table products add column if not exists image_url text;

create table if not exists suppliers (
  id serial primary key,
  name text not null,
  city text not null default '',
  phone text not null default ''
);

create table if not exists orders (
  id serial primary key,
  customer_name text not null,
  email text not null,
  phone text not null default '',
  address text not null,
  total integer not null,
  status text not null default 'placed'
    check (status in ('placed','packed','shipped','delivered','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id serial primary key,
  order_id integer not null references orders(id) on delete cascade,
  product_id integer references products(id),
  name text not null,
  unit_price integer not null,
  quantity integer not null check (quantity > 0)
);

create table if not exists purchase_orders (
  id serial primary key,
  supplier_id integer not null references suppliers(id),
  product_id integer not null references products(id),
  quantity integer not null check (quantity > 0),
  unit_cost integer not null check (unit_cost >= 0),
  status text not null default 'ordered' check (status in ('ordered','received')),
  created_at timestamptz not null default now(),
  received_at timestamptz
);

create index if not exists idx_orders_created on orders(created_at);
create index if not exists idx_items_order on order_items(order_id);
`;

const PRODUCTS: [string, string, string, number, number, number, string][] = [
  ["Kumbakonam Filter Coffee 250g", "Coffee & Tea", "Chicory-blend roast, ground for the South Indian filter.", 260, 48, 15, "☕"],
  ["Nilgiri Orthodox Tea 100g", "Coffee & Tea", "Bright, brisk leaf from high-altitude estates.", 180, 9, 12, "🍵"],
  ["Guntur Red Chilli Powder 200g", "Spices", "Hot and deep red. Stone-ground in small batches.", 120, 60, 20, "🌶️"],
  ["Tellicherry Black Pepper 100g", "Spices", "Large, aromatic berries with a slow heat.", 210, 35, 10, "🧂"],
  ["Green Cardamom 50g", "Spices", "Plump pods from Idukki, sweet and floral.", 340, 6, 10, "🌿"],
  ["Ponni Boiled Rice 5kg", "Rice & Grains", "Everyday rice for meals, soft and fluffy.", 390, 25, 8, "🌾"],
  ["Idli Rice 5kg", "Rice & Grains", "Short grain, made for soft idli and crisp dosa batter.", 360, 18, 8, "🍚"],
  ["Roasted Cashew 250g", "Snacks", "Whole kernels, lightly salted.", 295, 30, 10, "🥜"],
  ["Hand-pressed Murukku 200g", "Snacks", "Rice-flour spirals fried in groundnut oil.", 90, 55, 20, "🥨"],
  ["Brass Tumbler & Dabara Set", "Kitchenware", "Tin-lined brass, the way filter coffee is meant to be served.", 749, 14, 5, "🫖"],
  ["Cast Iron Dosa Tawa 12in", "Kitchenware", "Pre-seasoned, holds heat for even, crisp dosas.", 1190, 11, 5, "🍳"],
  ["Tabletop Wet Grinder 2L", "Kitchenware", "Stone drums for smooth batter in minutes.", 4500, 4, 3, "🪨"],
];

const SUPPLIERS = [
  ["Meenakshi Spice Traders", "Madurai", "+91 98430 00001"],
  ["Coimbatore Roasters", "Coimbatore", "+91 98430 00002"],
  ["Thanjavur Brassworks", "Thanjavur", "+91 98430 00003"],
];

const CUSTOMERS = [
  ["Priya Raman", "priya@example.com"],
  ["Arun Kumar", "arun@example.com"],
  ["Lakshmi Devi", "lakshmi@example.com"],
  ["Karthik S", "karthik@example.com"],
  ["Divya Nair", "divya@example.com"],
  ["Senthil Murugan", "senthil@example.com"],
];
const STATUSES = ["delivered", "delivered", "shipped", "packed", "placed", "cancelled"];

async function seed(client: PoolClient) {
  for (const [name, category, description, price, stock, reorder, emoji] of PRODUCTS) {
    await client.query(
      "insert into products(name,category,description,price,stock,reorder_level,emoji) values($1,$2,$3,$4,$5,$6,$7)",
      [name, category, description, price, stock, reorder, emoji],
    );
  }
  for (const [name, city, phone] of SUPPLIERS) {
    await client.query("insert into suppliers(name,city,phone) values($1,$2,$3)", [name, city, phone]);
  }
  const prods = (await client.query<{ id: number; name: string; price: number }>("select id,name,price from products")).rows;
  for (let i = 0; i < 28; i++) {
    const [cn, email] = CUSTOMERS[i % CUSTOMERS.length];
    const picks = [...prods].sort(() => Math.random() - 0.5).slice(0, 1 + (i % 3));
    const lines = picks.map((p) => ({ ...p, qty: 1 + ((i + p.id) % 3) }));
    const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const o = await client.query<{ id: number }>(
      `insert into orders(customer_name,email,phone,address,total,status,created_at)
       values($1,$2,'+91 90000 00000','12, Anna Nagar, Madurai 625020',$3,$4,
              now() - ($5 || ' days')::interval - ($6 || ' hours')::interval)
       returning id`,
      [cn, email, total, STATUSES[i % STATUSES.length], String(i % 7), String(i % 10)],
    );
    for (const l of lines) {
      await client.query(
        "insert into order_items(order_id,product_id,name,unit_price,quantity) values($1,$2,$3,$4,$5)",
        [o.rows[0].id, l.id, l.name, l.price, l.qty],
      );
    }
  }
}

/** Creates tables and loads demo data once. Safe to call on every cold start. */
export async function bootstrap(pool: Pool) {
  const client = await pool.connect();
  try {
    await client.query("select pg_advisory_lock(727001)");
    await client.query(SCHEMA);
    const done = await client.query("select 1 from meta where key = 'seeded'");
    if (done.rowCount === 0) {
      await client.query("begin");
      await seed(client);
      await client.query("insert into meta(key,value) values('seeded','1')");
      await client.query("commit");
    }
  } catch (e) {
    await client.query("rollback").catch(() => {});
    throw e;
  } finally {
    await client.query("select pg_advisory_unlock(727001)").catch(() => {});
    client.release();
  }
}

import type { ReactNode } from "react";

export type ArtKey =
  | "coffee" | "tea" | "chilli" | "pepper" | "cardamom" | "rice"
  | "cashew" | "murukku" | "tumbler" | "tawa" | "grinder" | "generic";

export function artFor(name: string, category = ""): ArtKey {
  const n = name.toLowerCase();
  if (n.includes("coffee")) return "coffee";
  if (n.includes("tea")) return "tea";
  if (n.includes("chilli") || n.includes("chili")) return "chilli";
  if (n.includes("pepper")) return "pepper";
  if (n.includes("cardamom")) return "cardamom";
  if (n.includes("rice")) return "rice";
  if (n.includes("cashew") || n.includes("nut")) return "cashew";
  if (n.includes("murukku") || n.includes("snack")) return "murukku";
  if (n.includes("tumbler") || n.includes("brass")) return "tumbler";
  if (n.includes("tawa") || n.includes("dosa")) return "tawa";
  if (n.includes("grinder")) return "grinder";
  const c = category.toLowerCase();
  if (c.includes("coffee")) return "coffee";
  if (c.includes("spice")) return "chilli";
  if (c.includes("rice")) return "rice";
  if (c.includes("snack")) return "murukku";
  if (c.includes("kitchen")) return "tawa";
  return "generic";
}

const Shadow = () => <ellipse cx="100" cy="178" rx="56" ry="7" fill="#14213D" opacity=".14" />;

const Pouch = ({ body, dark, label, children }: { body: string; dark: string; label: string; children: ReactNode }) => (
  <g>
    <Shadow />
    <path d="M50 48h100l6 122q0 8-8 8H52q-8 0-8-8z" fill={body} />
    <path d="M50 48h100l1.5 16H48.500z" fill={dark} />
    <path d="M52 56h96" stroke="#000" strokeOpacity=".25" strokeWidth="2" strokeDasharray="3 3" />
    <path d="M58 70h12l-3 100h-6z" fill="#fff" opacity=".08" />
    <rect x="66" y="86" width="68" height="70" rx="10" fill={label} />
    {children}
    <path d="M86 36q-6-8 0-16M100 33q-6-8 0-16M114 36q-6-8 0-16" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" opacity=".45" />
  </g>
);

const ART: Record<ArtKey, ReactNode> = {
  coffee: (
    <Pouch body="#7A4528" dark="#4E2A18" label="#F7E8CE">
      <ellipse cx="100" cy="112" rx="12" ry="17" fill="#6B3A20" transform="rotate(25 100 112)" />
      <path d="M93 98q10 12 9 28" stroke="#F7E8CE" strokeWidth="2.500" fill="none" strokeLinecap="round" />
      <rect x="78" y="136" width="44" height="4" rx="2" fill="#6B3A20" />
      <rect x="84" y="144" width="32" height="3" rx="1.500" fill="#B08968" />
    </Pouch>
  ),
  tea: (
    <Pouch body="#2F6B4F" dark="#1D4733" label="#EAF3E4">
      <path d="M100 138C78 126 76 104 100 92c24 12 22 34 0 46z" fill="#3E8A64" />
      <path d="M100 96v40" stroke="#EAF3E4" strokeWidth="2" />
      <path d="M100 112l-10-7M100 122l11-8M100 130l-9-6" stroke="#EAF3E4" strokeWidth="1.800" strokeLinecap="round" />
      <rect x="82" y="142" width="36" height="3" rx="1.500" fill="#2F6B4F" />
    </Pouch>
  ),
  chilli: (
    <g>
      <Shadow />
      <g transform="rotate(-14 100 100)">
        <path d="M70 62C42 112 74 168 140 170c-34-20-52-62-46-106z" fill="#C8281E" />
        <path d="M80 70c-4 30 4 60 28 84" stroke="#fff" strokeOpacity=".28" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M68 64q12-20 30 0" stroke="#2F6B4F" strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      <g transform="translate(46 8) rotate(16 100 100)">
        <path d="M70 62C46 108 74 160 130 164c-30-18-44-58-38-102z" fill="#E2412E" />
        <path d="M78 70c-3 26 4 52 24 72" stroke="#fff" strokeOpacity=".3" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M68 64q11-18 28 0" stroke="#3E8A64" strokeWidth="8" fill="none" strokeLinecap="round" />
      </g>
    </g>
  ),
  pepper: (
    <g>
      <Shadow />
      <path d="M38 112h124q-2 52-62 56-60-4-62-56z" fill="#8A5A3C" />
      <path d="M50 120q50 16 100 0" stroke="#fff" strokeOpacity=".15" strokeWidth="4" fill="none" />
      <ellipse cx="100" cy="112" rx="62" ry="13" fill="#2E211B" />
      {[[62,104],[78,98],[94,94],[110,96],[126,100],[140,106],[70,112],[88,108],[104,108],[120,110],[134,114],[80,90],[100,86],[118,88],[96,100],[112,102],[84,102]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="8" fill="#241B17" />
          <circle cx={x - 2.500} cy={y - 2.500} r="2.200" fill="#fff" opacity=".28" />
        </g>
      ))}
    </g>
  ),
  cardamom: (
    <g>
      <Shadow />
      {[[-30, 14, 0], [0, -6, 22], [32, 16, -18], [4, 40, 40]].map(([dx, dy, r], i) => (
        <g key={i} transform={`translate(${dx} ${dy}) rotate(${r} 100 100)`}>
          <ellipse cx="100" cy="86" rx="22" ry="44" fill={i % 2 ? "#8DB255" : "#7FA650"} />
          <path d="M100 44v84M88 52q-6 34 0 66M112 52q6 34 0 66" stroke="#4F7230" strokeWidth="2" fill="none" />
          <ellipse cx="94" cy="70" rx="4" ry="14" fill="#fff" opacity=".2" />
        </g>
      ))}
    </g>
  ),
  rice: (
    <g>
      <Shadow />
      <path d="M52 72q-10 52-2 100 50 12 100 0 8-48-2-100z" fill="#D9B77E" />
      <path d="M52 72q48 18 96 0l3 14q-51 18-102 0z" fill="#C79F5E" />
      <path d="M66 72q34-28 68 0" fill="#E3C690" />
      <rect x="60" y="64" width="80" height="10" rx="5" fill="#9A2F25" />
      <rect x="72" y="100" width="56" height="52" rx="8" fill="#F8F2E1" />
      <path d="M100 146v-34" stroke="#B08A3E" strokeWidth="2" />
      {[[-9, 0], [9, 0], [-9, 12], [9, 12], [-9, 24], [9, 24]].map(([dx, dy], i) => (
        <ellipse key={i} cx={100 + dx} cy={116 + dy} rx="4" ry="7" fill="#D9B77E" transform={`rotate(${dx < 0 ? -28 : 28} ${100 + dx} ${116 + dy})`} />
      ))}
      <path d="M60 150q-4-40 4-70" stroke="#fff" strokeOpacity=".25" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  ),
  cashew: (
    <g>
      <Shadow />
      {[[-4, -8, 0, "#E3B576"], [26, 22, 60, "#D9A55C"], [-26, 30, -50, "#E8C088"]].map(([dx, dy, r, c], i) => (
        <g key={i} transform={`translate(${dx} ${dy}) rotate(${r} 100 100)`}>
          <path d="M60 112C34 70 86 34 124 66c10 8 8 24-6 22-16-2-26 8-24 24 2 20-14 34-34 0z" fill={c as string} />
          <path d="M70 90q14-24 40-20" stroke="#fff" strokeOpacity=".35" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      ))}
    </g>
  ),
  murukku: (
    <g>
      <Shadow />
      <g>
        {[14, 27, 40, 53].map((r, i) => (
          <circle key={i} cx="96" cy="100" r={r} fill="none" stroke={i % 2 ? "#E0A93B" : "#EDB84A"} strokeWidth="11" />
        ))}
        <circle cx="96" cy="100" r="7" fill="#E0A93B" />
      </g>
      <g transform="translate(54 50)">
        {[7, 14, 21].map((r, i) => (
          <circle key={i} cx="46" cy="46" r={r} fill="none" stroke={i % 2 ? "#D89B2C" : "#E8B343"} strokeWidth="7" />
        ))}
      </g>
      {[[66,60],[130,78],[100,140],[70,128],[120,54],[142,120],[84,100]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.600" fill="#fff" opacity=".5" />
      ))}
    </g>
  ),
  tumbler: (
    <g>
      <Shadow />
      <ellipse cx="100" cy="158" rx="68" ry="13" fill="#A9760F" />
      <path d="M32 156q68 40 136 0v-8q-68 30-136 0z" fill="#C8921B" />
      <g transform="translate(0 16)">
      <path d="M70 46h60l-6 90q-24 9-48 0z" fill="#E2B13C" />
      <path d="M78 52h10l-4 80h-6z" fill="#fff" opacity=".35" />
      <path d="M124 52h6l-5 78h-5z" fill="#A9760F" opacity=".35" />
      <ellipse cx="100" cy="46" rx="30" ry="8" fill="#B8841A" />
      <ellipse cx="100" cy="47" rx="26" ry="6" fill="#5A3420" />
      <path d="M72 100h56" stroke="#A9760F" strokeWidth="2" />
      <path d="M94 34q-6-8 0-14M108 32q-6-8 0-14" stroke="#7A4528" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".5" />
      </g>
    </g>
  ),
  tawa: (
    <g>
      <Shadow />
      <rect x="150" y="112" width="42" height="11" rx="5.500" fill="#23232B" transform="rotate(-6 150 112)" />
      <ellipse cx="96" cy="124" rx="72" ry="28" fill="#23232B" />
      <ellipse cx="96" cy="116" rx="68" ry="25" fill="#3A3A46" />
      <ellipse cx="96" cy="114" rx="52" ry="18" fill="#E9B44C" />
      <ellipse cx="96" cy="114" rx="34" ry="11" fill="#F2C766" />
      <path d="M70 112q26-10 52 0" stroke="#C98F2A" strokeWidth="2" fill="none" />
      <path d="M40 106q20-14 40-14" stroke="#fff" strokeOpacity=".15" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M86 84q-6-9 0-17M102 82q-6-9 0-17" stroke="#8892A6" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".6" />
    </g>
  ),
  grinder: (
    <g>
      <Shadow />
      <rect x="38" y="140" width="124" height="26" rx="10" fill="#14213D" />
      <path d="M46 70v72q54 22 108 0V70z" fill="#9AA1B2" />
      <path d="M56 80h12v54l-12-4z" fill="#fff" opacity=".3" />
      <ellipse cx="100" cy="70" rx="54" ry="15" fill="#C4C9D6" />
      <ellipse cx="100" cy="70" rx="42" ry="10" fill="#6C7385" />
      <ellipse cx="100" cy="68" rx="20" ry="5.500" fill="#4B5164" />
      <path d="M154 96h20q8 0 8 8v14" stroke="#14213D" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="140" cy="154" r="4" fill="#F2B705" />
    </g>
  ),
  generic: (
    <g>
      <Shadow />
      <path d="M44 74l56-22 56 22v78l-56 22-56-22z" fill="#C79F5E" />
      <path d="M44 74l56 22 56-22M100 96v78" stroke="#9A7B3E" strokeWidth="3" fill="none" />
      <path d="M72 62l56 22" stroke="#9A7B3E" strokeWidth="3" />
    </g>
  ),
};

export default function ProductArt({
  name,
  category = "",
  className = "",
}: {
  name: string;
  category?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={name} xmlns="http://www.w3.org/2000/svg">
      {ART[artFor(name, category)]}
    </svg>
  );
}

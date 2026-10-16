/** Illustrated banana-leaf meal, shown in the hero until a real photograph is added. */
export default function BananaLeafArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-label="Illustration of a traditional South Indian meal on a banana leaf" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leaf" x1="0" x2="1">
          <stop offset="0" stopColor="#2A6B34" />
          <stop offset=".5" stopColor="#3F8A47" />
          <stop offset="1" stopColor="#2A6B34" />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill="#3A2216" />
      {[60, 130, 200, 270, 340, 410, 480].map((y) => (
        <path key={y} d={`M0 ${y}H400`} stroke="#2B1B12" strokeWidth="3" opacity=".55" />
      ))}
      <path d="M200 18C300 30 372 110 370 250s-72 220-170 232C102 470 30 390 30 250S100 30 200 18z" fill="url(#leaf)" />
      <path d="M200 24V478" stroke="#1F5128" strokeWidth="4" opacity=".6" />
      {[70, 110, 150, 190, 230, 270, 310, 350, 390, 430].map((y) => (
        <g key={y} stroke="#1F5128" strokeWidth="1.6" opacity=".4">
          <path d={`M200 ${y}Q140 ${y - 8} 62 ${y - 26}`} fill="none" />
          <path d={`M200 ${y}Q260 ${y - 8} 338 ${y - 26}`} fill="none" />
        </g>
      ))}
      {/* appalam */}
      <circle cx="200" cy="92" r="30" fill="#E6C27A" />
      {[[188, 84], [208, 96], [196, 104], [214, 80], [184, 98]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.5" fill="#C99A45" />
      ))}
      {/* poriyal + kootu */}
      <circle cx="108" cy="150" r="30" fill="#7FA650" />
      {[[96, 142], [112, 138], [120, 156], [100, 160], [114, 148]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" fill={i % 2 ? "#F2D26B" : "#C8281E"} />
      ))}
      <circle cx="292" cy="150" r="30" fill="#E8A200" />
      <circle cx="292" cy="150" r="20" fill="#F2C24A" opacity=".7" />
      {/* rice */}
      <ellipse cx="200" cy="300" rx="78" ry="50" fill="#FFFDF5" />
      <path d="M130 292Q200 226 270 292Q200 262 130 292z" fill="#FFFFFF" />
      {[[170, 290], [190, 276], [212, 284], [232, 296], [200, 304], [176, 312], [224, 318]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx="6" ry="2.6" fill="#EDE6CF" transform={`rotate(${i * 25} ${x} ${y})`} />
      ))}
      {/* sambar + rasam katoris */}
      <circle cx="108" cy="290" r="34" fill="#C9CED6" />
      <circle cx="108" cy="290" r="27" fill="#B5651D" />
      <circle cx="100" cy="284" r="5" fill="#E8A200" />
      <circle cx="116" cy="296" r="4" fill="#7FA650" />
      <circle cx="292" cy="290" r="34" fill="#C9CED6" />
      <circle cx="292" cy="290" r="27" fill="#C2381E" />
      {/* pickle + salt + curd */}
      <circle cx="82" cy="372" r="9" fill="#B3261E" />
      <circle cx="104" cy="384" r="6" fill="#F4F0E4" />
      <circle cx="298" cy="372" r="22" fill="#C9CED6" />
      <circle cx="298" cy="372" r="16" fill="#FFFDF5" />
      {/* banana */}
      <path d="M122 420Q210 470 292 410Q282 454 206 462Q146 458 122 420z" fill="#F2C24A" />
      <path d="M132 424Q210 462 282 416" stroke="#D9A21B" strokeWidth="2" fill="none" />
    </svg>
  );
}

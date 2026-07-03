const R = 32;

function sweep(from, to) {
  const dirs = ['N', 'E', 'S', 'W'];
  return ((dirs.indexOf(to) - dirs.indexOf(from) + 4) % 4) === 1 ? 1 : 0;
}

function dir(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? 'E' : 'W';
  return dy > 0 ? 'S' : 'N';
}

function buildOrth(corners, r = R) {
  const parts = [];
  let pos = { ...corners[0] };
  parts.push(`M ${pos.x} ${pos.y}`);

  for (let i = 1; i < corners.length; i += 1) {
    const corner = corners[i];
    const prev = corners[i - 1];
    const d = dir(prev, corner);
    const dist = Math.abs(corner.x - prev.x || corner.y - prev.y);
    const hasNext = i < corners.length - 1;
    const run = hasNext ? dist - r : dist;
    const end = {
      x: pos.x + (d === 'E' ? run : d === 'W' ? -run : 0),
      y: pos.y + (d === 'S' ? run : d === 'N' ? -run : 0),
    };

    parts.push(d === 'E' || d === 'W' ? `H ${end.x}` : `V ${end.y}`);
    pos = end;

    if (hasNext) {
      const nd = dir(corner, corners[i + 1]);
      parts.push(`A ${r} ${r} 0 0 ${sweep(d, nd)} ${corner.x} ${corner.y}`);
      pos = { ...corner };
    }
  }

  return parts.join(' ');
}

const COL_L = 103;
const COL_M = 600;
const COL_R = 1097;
const TOP_ICON = 184;
const BOT_ICON = 462;
const TOP_BUS = 264;
const BOT_BUS = 398;

const corners = [
  { x: COL_L, y: TOP_ICON },
  { x: COL_L, y: TOP_BUS },
  { x: COL_M, y: TOP_BUS },
  { x: COL_M, y: TOP_ICON },
  { x: COL_M, y: TOP_BUS },
  { x: COL_R, y: TOP_BUS },
  { x: COL_R, y: TOP_ICON },
  { x: COL_R, y: BOT_ICON },
  { x: COL_R, y: BOT_BUS },
  { x: COL_M, y: BOT_BUS },
  { x: COL_M, y: BOT_ICON },
  { x: COL_M, y: BOT_BUS },
  { x: COL_L, y: BOT_BUS },
  { x: COL_L, y: BOT_ICON },
];

console.log(buildOrth(corners));

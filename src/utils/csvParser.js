function normalizeHeaders(row) {
  const map = {};
  for (const k of Object.keys(row)) {
    map[k.trim().toLowerCase()] = k;
  }
  return (...names) => {
    for (const n of names) {
      const key = map[n.toLowerCase()];
      if (key) return key;
    }
    return undefined;
  };
}

function stripIdFromName(raw) {
  if (!raw) return "";
  return String(raw)
    .replace(/\s*\(id:\s*\d+\)\s*$/i, "")
    .replace(/\s*\(\d+\)\s*$/, "")
    .replace(/\s*[-–—]\s*id:\s*\d+$/i, "")
    .replace(/\s*[-–—]\s*\d+$/, "")
    .trim();
}

export function normalizePlayers(rows) {
  const out = [];
  let lastHeaders = [];
  
  for (const row of rows) {
    lastHeaders = Object.keys(row);
    const pick = normalizeHeaders(row);
    
    let nameK = pick("name", "player", "player name");
    const nameIdK = pick("name + id");
    const rosterPosK = pick("roster position", "rosterpos", "roster");
    const posK = pick("position", "pos") || rosterPosK;
    const teamK = pick("teamabbrev", "team", "tm", "team abbrev");
    const salK = pick("salary", "sal", "cost");
    
    if ((!nameK && !nameIdK) || !posK || !teamK || !salK) continue;

    let rawName = nameK ? String(row[nameK]).trim() : String(row[nameIdK]).trim();
    rawName = stripIdFromName(rawName);

    // Try to get opponent from multiple possible column names
    const oppK = pick("opponent", "opp", "oppt");
    let opponent = oppK ? String(row[oppK]).trim().toUpperCase() : "";
    
    // Get game info
    const gameInfoK = pick("gameinfo", "game info", "game");
    const gameInfo = gameInfoK ? String(row[gameInfoK]).trim() : "";
    
    // If no opponent column, try to extract from game info (e.g., "IND@MIA" or "MIA vs IND")
    if (!opponent && gameInfo) {
      const team = String(row[teamK]).trim().toUpperCase();
      // Match patterns like "IND@MIA", "MIA@IND", "IND vs MIA", "MIA vs IND"
      const atMatch = gameInfo.match(/@([A-Z]{2,4})/);
      const vsMatch = gameInfo.match(/vs\s+([A-Z]{2,4})/i);
      const homeMatch = gameInfo.match(/([A-Z]{2,4})@/);
      
      if (atMatch && atMatch[1] !== team) {
        opponent = "@" + atMatch[1];
      } else if (homeMatch && homeMatch[1] !== team) {
        opponent = "vs " + homeMatch[1];
      } else if (vsMatch && vsMatch[1] !== team) {
        opponent = "vs " + vsMatch[1];
      }
    }

    const p = {
      name: rawName,
      position: String(row[posK]).trim().toUpperCase().split("/")[0], // handle "RB/FLEX"
      rosterPosition: rosterPosK ? String(row[rosterPosK]).trim().toUpperCase() : "",
      team: String(row[teamK]).trim().toUpperCase(),
      salary: Number(String(row[salK]).replace(/[^0-9.]/g, "")) || 0,
      gameInfo: gameInfo,
      opponent: opponent,
      ownership: null
    };
    
    if (!p.name || !p.position || !p.team) continue;
    out.push(p);
  }

  const hasShowdownStyleRows = out.some(
    p => p.position === 'CPT' || p.position === 'FLEX' || p.rosterPosition === 'CPT' || p.rosterPosition === 'FLEX'
  );

  // DraftKings Showdown salary files often contain duplicate rows per player (CPT/FLEX).
  // Collapse these to one player record, preferring the lower salary (usually FLEX/base salary).
  const players = hasShowdownStyleRows
    ? Array.from(
        out.reduce((acc, player) => {
          const key = `${player.name}|${player.team}`;
          const prev = acc.get(key);
          if (!prev || player.salary < prev.salary) {
            acc.set(key, player);
          }
          return acc;
        }, new Map()).values()
      )
    : out;

  return { players, lastHeaders };
}

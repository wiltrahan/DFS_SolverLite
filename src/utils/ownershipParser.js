import { TEAM_ALIASES } from './constants';

function _norm(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

export function normName(name) {
  let s = String(name || "").replace(/\b(jr|sr|iii|ii)\b/ig, "");
  return _norm(s);
}

function removeDstMarkers(str) {
  if (!str) return "";
  return String(str)
    .replace(/\bdefense\b/ig, "")
    .replace(/\bdef\b/ig, "")
    .replace(/\bd\/st\b/ig, "")
    .replace(/\bdst\b/ig, "")
    .replace(/d\/st/ig, "")
    .replace(/d-?st/ig, "")
    .trim();
}

export function parsePastedOwnership(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const out = {};
  
  for (const line of lines) {
    const parts = line.split(/,|\t|\|/).map(s => s.trim()).filter(Boolean);
    let name = null, pct = null;
    
    const m = line.match(/(\d+(?:\.\d+)?)\s*%/);
    if (m) pct = parseFloat(m[1]);
    
    if (parts.length >= 2) {
      name = parts[0];
      if (!pct) {
        for (let i = 1; i < parts.length; i++) {
          const mm = parts[i].match(/(\d+(?:\.\d+)?)\s*%/);
          if (mm) {
            pct = parseFloat(mm[1]);
            break;
          }
        }
      }
    }
    
    if (!name) {
      name = line.replace(/(\d+(\.\d+)?)\s*%.*$/, "").replace(/[-–—|,]+/g, " ").trim();
    }
    
    if (!name || pct === null || isNaN(pct)) continue;
    
    const cleaned = removeDstMarkers(name);
    out[normName(cleaned)] = pct;
  }
  
  return out;
}

export function aliasDstFromDict(dict) {
  const byAlias = {};
  for (const key in dict) {
    for (const abbr in TEAM_ALIASES) {
      const aliases = TEAM_ALIASES[abbr];
      if (aliases.some(a => key.includes(a))) {
        byAlias[abbr] = dict[key];
      }
    }
  }
  return byAlias;
}

export function parseOwnershipCSV(rows) {
  const dict = {};
  
  for (const row of rows) {
    const keys = Object.keys(row);
    const nk = keys.find(k => /name|player/i.test(k));
    const ok = keys.find(k => /own/i.test(k));
    
    if (!nk || !ok) continue;
    
    const name = String(row[nk]).trim();
    const own = Number(String(row[ok]).replace(/[^0-9.]/g, ""));
    
    if (name) {
      dict[normName(removeDstMarkers(name))] = isNaN(own) ? 0 : own;
    }
  }
  
  return dict;
}

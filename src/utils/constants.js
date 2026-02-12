export const SALARY_CAP = 50000;
export const CAPTAIN_MULTIPLIER = 1.5;
export const CONTEST_MODES = {
  CLASSIC: 'classic',
  SHOWDOWN: 'showdown'
};

export const FLEX_POS = new Set(["RB", "WR", "TE"]);

export const POS_TABS = ["ALL", "QB", "RB", "WR", "TE", "FLEX", "DST"];
export const SHOWDOWN_POS_TABS = ["ALL"];

export const SLOT_DEF = [
  { key: "QB", label: "QB", accepts: new Set(["QB"]) },
  { key: "RB1", label: "RB", accepts: new Set(["RB"]) },
  { key: "RB2", label: "RB", accepts: new Set(["RB"]) },
  { key: "WR1", label: "WR", accepts: new Set(["WR"]) },
  { key: "WR2", label: "WR", accepts: new Set(["WR"]) },
  { key: "WR3", label: "WR", accepts: new Set(["WR"]) },
  { key: "TE", label: "TE", accepts: new Set(["TE"]) },
  { key: "FLEX", label: "FLEX", accepts: new Set(["RB", "WR", "TE"]) },
  { key: "DST", label: "DST", accepts: new Set(["DST"]) },
];

export const SHOWDOWN_SLOT_DEF = [
  { key: "CPT", label: "CPT", accepts: new Set(["ANY"]) },
  { key: "FLEX1", label: "FLEX", accepts: new Set(["ANY"]) },
  { key: "FLEX2", label: "FLEX", accepts: new Set(["ANY"]) },
  { key: "FLEX3", label: "FLEX", accepts: new Set(["ANY"]) },
  { key: "FLEX4", label: "FLEX", accepts: new Set(["ANY"]) },
  { key: "FLEX5", label: "FLEX", accepts: new Set(["ANY"]) }
];

export const TEAM_ALIASES = {
  ARI: ["cardinals", "ari", "arizona"],
  ATL: ["falcons", "atl", "atlanta"],
  BAL: ["ravens", "bal", "baltimore"],
  BUF: ["bills", "buf", "buffalo"],
  CAR: ["panthers", "car", "carolina"],
  CHI: ["bears", "chi", "chicago"],
  CIN: ["bengals", "cin", "cincinnati"],
  CLE: ["browns", "cle", "cleveland"],
  DAL: ["cowboys", "dal", "dallas"],
  DEN: ["broncos", "den", "denver"],
  DET: ["lions", "det", "detroit"],
  GB: ["packers", "gb", "greenbay", "green bay"],
  HOU: ["texans", "hou", "houston"],
  IND: ["colts", "ind", "indianapolis"],
  JAX: ["jaguars", "jax", "jacksonville", "jags"],
  KC: ["chiefs", "kc", "kansas city", "kansascity"],
  LAC: ["chargers", "lac", "los angeles chargers", "la chargers", "san diego chargers", "chargers"],
  LAR: ["rams", "lar", "los angeles rams", "la rams", "st louis rams", "rams"],
  LV: ["raiders", "lv", "las vegas raiders", "oakland raiders", "raiders"],
  MIA: ["dolphins", "mia", "miami"],
  MIN: ["vikings", "min", "minnesota"],
  NE: ["patriots", "ne", "new england", "newengland"],
  NO: ["saints", "no", "new orleans", "neworleans"],
  NYG: ["giants", "nyg", "new york giants", "newyork giants"],
  NYJ: ["jets", "nyj", "new york jets", "newyork jets"],
  PHI: ["eagles", "phi", "philadelphia"],
  PIT: ["steelers", "pit", "pittsburgh"],
  SEA: ["seahawks", "sea", "hawks", "seattle"],
  SF: ["49ers", "sf", "san francisco", "niners", "fortyniners", "forty niners"],
  TB: ["buccaneers", "tb", "bucs", "tampa bay", "tampabay"],
  TEN: ["titans", "ten", "tennessee"],
  WAS: ["commanders", "was", "washington", "wft", "football team"]
};

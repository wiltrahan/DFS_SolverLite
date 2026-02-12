import {
  SALARY_CAP,
  SLOT_DEF,
  FLEX_POS,
  SHOWDOWN_SLOT_DEF,
  CAPTAIN_MULTIPLIER,
  CONTEST_MODES
} from './constants';

function getActiveSlotDef(contestMode) {
  return contestMode === CONTEST_MODES.SHOWDOWN ? SHOWDOWN_SLOT_DEF : SLOT_DEF;
}

export function playerKey(player) {
  return `${player?.name || ''}::${player?.team || ''}`;
}

function getSlotCost(slot, contestMode, slotIndex) {
  const baseSalary = slot?.player?.salary || 0;
  if (contestMode === CONTEST_MODES.SHOWDOWN && (slot?.isCaptain || slotIndex === 0)) {
    return Math.round(baseSalary * CAPTAIN_MULTIPLIER);
  }
  return baseSalary;
}

export function sumSalary(lineupSlots, contestMode = CONTEST_MODES.CLASSIC) {
  return lineupSlots.reduce((s, slot, idx) => s + getSlotCost(slot, contestMode, idx), 0);
}

export function sumOwnership(lineupSlots) {
  return lineupSlots.reduce((s, slot) => s + (slot?.player?.ownership || 0), 0);
}

export function remaining(lineupSlots, contestMode = CONTEST_MODES.CLASSIC) {
  return SALARY_CAP - sumSalary(lineupSlots, contestMode);
}

export function namesInLineup(lineupSlots) {
  return new Set(lineupSlots.filter(Boolean).map(s => playerKey(s.player)));
}

export function canPlace(
  player,
  lineupSlots,
  contestMode = CONTEST_MODES.CLASSIC,
  targetSlot = 'AUTO'
) {
  if (namesInLineup(lineupSlots).has(playerKey(player))) return false;

  const activeSlotDef = getActiveSlotDef(contestMode);
  const rem = remaining(lineupSlots, contestMode);

  if (contestMode === CONTEST_MODES.SHOWDOWN) {
    const captainIdx = activeSlotDef.findIndex(s => s.key === 'CPT');
    const captainCost = Math.round(player.salary * CAPTAIN_MULTIPLIER);
    const canUseCaptain = captainIdx >= 0 && !lineupSlots[captainIdx] && captainCost <= rem;
    const canUseFlex = activeSlotDef.some((def, idx) => def.key.startsWith('FLEX') && !lineupSlots[idx] && player.salary <= rem);

    if (targetSlot === 'CPT') return canUseCaptain;
    if (targetSlot === 'FLEX') return canUseFlex;
    return canUseCaptain || canUseFlex;
  }

  if (player.salary > rem) return false;

  for (let i = 0; i < activeSlotDef.length; i++) {
    const def = activeSlotDef[i];
    if (lineupSlots[i]) continue;
    if (def.accepts.has(player.position)) return true;
  }

  if (FLEX_POS.has(player.position)) {
    const flexIndex = activeSlotDef.findIndex(s => s.key === 'FLEX');
    if (!lineupSlots[flexIndex]) return true;
  }

  return false;
}

export function placePlayer(
  player,
  lineupSlots,
  contestMode = CONTEST_MODES.CLASSIC,
  targetSlot = 'AUTO'
) {
  if (namesInLineup(lineupSlots).has(playerKey(player))) return lineupSlots;

  const activeSlotDef = getActiveSlotDef(contestMode);
  const newSlots = [...lineupSlots];

  if (contestMode === CONTEST_MODES.SHOWDOWN) {
    const captainIdx = activeSlotDef.findIndex(s => s.key === 'CPT');

    if (
      targetSlot === 'CPT' &&
      canPlace(player, lineupSlots, contestMode, 'CPT') &&
      captainIdx >= 0
    ) {
      newSlots[captainIdx] = { player, isCaptain: true };
      return newSlots;
    }

    const placeInFirstFlex = () => {
      for (let i = 0; i < activeSlotDef.length; i++) {
        if (!activeSlotDef[i].key.startsWith('FLEX') || newSlots[i]) continue;
        if (canPlace(player, newSlots, contestMode, 'FLEX')) {
          newSlots[i] = { player, isCaptain: false };
          return true;
        }
      }
      return false;
    };

    if (targetSlot === 'FLEX') {
      if (placeInFirstFlex()) return newSlots;
      return lineupSlots;
    }

    if (targetSlot === 'AUTO') {
      if (placeInFirstFlex()) return newSlots;
      if (
        canPlace(player, lineupSlots, contestMode, 'CPT') &&
        captainIdx >= 0 &&
        !newSlots[captainIdx]
      ) {
        newSlots[captainIdx] = { player, isCaptain: true };
        return newSlots;
      }
    }

    return lineupSlots;
  }

  for (let i = 0; i < activeSlotDef.length; i++) {
    const def = activeSlotDef[i];
    if (newSlots[i]) continue;
    if (def.accepts.has(player.position)) {
      newSlots[i] = { player, isCaptain: false };
      return newSlots;
    }
  }

  if (FLEX_POS.has(player.position)) {
    const i = activeSlotDef.findIndex(s => s.key === 'FLEX');
    if (i >= 0 && !newSlots[i]) {
      newSlots[i] = { player, isCaptain: false };
      return newSlots;
    }
  }

  return lineupSlots;
}

export function removeSlot(index, lineupSlots) {
  const newSlots = [...lineupSlots];
  newSlots[index] = null;
  return newSlots;
}

export function validateLineup(lineupSlots, contestMode = CONTEST_MODES.CLASSIC) {
  const salary = sumSalary(lineupSlots, contestMode);
  const counts = { QB: 0, RB: 0, WR: 0, TE: 0, DST: 0 };

  lineupSlots.forEach(s => {
    if (s?.player && counts.hasOwnProperty(s.player.position)) counts[s.player.position]++;
  });

  const errors = [];
  if (salary > SALARY_CAP) errors.push(`Salary cap exceeded (${salary.toLocaleString()}).`);

  if (contestMode === CONTEST_MODES.SHOWDOWN) {
    if (!lineupSlots.every(Boolean)) errors.push('Lineup must have exactly 6 players.');
    const teams = new Set(lineupSlots.filter(Boolean).map(s => s.player.team));
    if (teams.size < 2) errors.push('Lineup must include players from both teams.');
  } else {
    if (!lineupSlots.every(Boolean)) errors.push('Lineup must have exactly 9 players.');
    if (counts.QB < 1) errors.push('Need at least 1 QB.');
    if (counts.RB < 2) errors.push('Need at least 2 RB.');
    if (counts.WR < 3) errors.push('Need at least 3 WR.');
    if (counts.TE < 1) errors.push('Need at least 1 TE.');
    if (counts.DST < 1) errors.push('Need at least 1 DST.');
  }

  return { ok: errors.length === 0, errors, salary, counts };
}

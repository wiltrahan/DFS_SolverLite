import {
  SLOT_DEF,
  SHOWDOWN_SLOT_DEF,
  CAPTAIN_MULTIPLIER,
  CONTEST_MODES
} from '../utils/constants';

export default function LineupSlots({ lineupSlots, onRemoveSlot, contestMode }) {
  const activeSlotDef = contestMode === CONTEST_MODES.SHOWDOWN ? SHOWDOWN_SLOT_DEF : SLOT_DEF;

  return (
    <div className="mt-3 grid gap-2">
      {activeSlotDef.map((slot, i) => {
        const curr = lineupSlots[i];
        const player = curr?.player;
        const isCaptainSlot = contestMode === CONTEST_MODES.SHOWDOWN && slot.key === 'CPT';
        const shownSalary = player
          ? (isCaptainSlot ? Math.round(player.salary * CAPTAIN_MULTIPLIER) : player.salary)
          : 0;
        const line = player
          ? `${player.name} — ${player.team} — $${shownSalary.toLocaleString()}`
          : "—";
        
        return (
          <div key={i} className={`slot ${player ? '' : 'slot-empty'}`}>
            <div className="chip">
              {slot.label}
              {isCaptainSlot ? ' 1.5x' : ''}
            </div>
            <div className="nowrap">{line}</div>
            <div>
              {player && (
                <button 
                  className="btn btn-danger" 
                  onClick={() => onRemoveSlot(i)}
                >
                  X
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

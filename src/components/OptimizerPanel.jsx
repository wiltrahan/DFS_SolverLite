import { SALARY_CAP, SLOT_DEF, SHOWDOWN_SLOT_DEF, CONTEST_MODES } from '../utils/constants';
import { validateLineup, sumOwnership, remaining } from '../utils/lineupValidator';
import { formatCurrency, formatPercent } from '../utils/formatters';
import LineupSlots from './LineupSlots';

export default function OptimizerPanel({ 
  lineupSlots, 
  onRemoveSlot, 
  onSave, 
  onClear,
  title,
  onTitleChange,
  isEditing,
  contestMode
}) {
  const { ok, errors, salary } = validateLineup(lineupSlots, contestMode);
  const rem = remaining(lineupSlots, contestMode);
  const activeSlotDef = contestMode === CONTEST_MODES.SHOWDOWN ? SHOWDOWN_SLOT_DEF : SLOT_DEF;
  const filled = lineupSlots.filter(Boolean).length;
  const left = activeSlotDef.length - filled;
  const remPer = left > 0 ? Math.floor(rem / left) : 0;
  const ownSum = sumOwnership(lineupSlots);

  return (
    <div className="card p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="font-semibold">Optimizer</div>
          {isEditing && (
            <span className="chip chip-lime" style={{ fontSize: '10px' }}>
              EDITING
            </span>
          )}
        </div>
        <div className="muted">
          Rem: <span className="mono">{formatCurrency(rem)}</span>
        </div>
      </div>

      <div className="bar-outer my-2">
        <div 
          className="bar-inner" 
          style={{ width: `${Math.min(100, (salary / SALARY_CAP) * 100)}%` }}
        />
      </div>
      <div className="muted">
        Used: <span className="mono">{formatCurrency(salary)}</span> / {formatCurrency(SALARY_CAP)}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="chip chip-lime">Own% Sum</span>
          <span className="mono">{formatPercent(ownSum)}</span>
        </div>
        <div className="flex items-center justify-end gap-2">
          <span className="chip chip-lime">Remain/slot</span>
          <span className="mono">{formatCurrency(remPer)}</span>
          <span className="muted">
            {left > 0 ? `(${left} slots left)` : '(complete)'}
          </span>
        </div>
      </div>

      {contestMode === CONTEST_MODES.SHOWDOWN && (
        <div className="muted mt-2">
          Showdown: 1 Captain (1.5x salary) + 5 FLEX. Must include both teams.
        </div>
      )}

      <LineupSlots
        lineupSlots={lineupSlots}
        onRemoveSlot={onRemoveSlot}
        contestMode={contestMode}
      />

      <div style={{ color: '#fda4af' }} className="text-xs mt-3">
        {!ok && (
          <ul style={{ paddingLeft: '18px', listStyle: 'disc' }}>
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          className="input"
          placeholder="Optional title (e.g., 'Mahomes stack')"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <button 
          className="btn btn-primary" 
          disabled={!ok}
          onClick={onSave}
        >
          {isEditing ? 'Update' : 'Save'}
        </button>
        <button className="btn" onClick={onClear}>
          Clear Lineup
        </button>
      </div>
    </div>
  );
}

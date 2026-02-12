import { POS_TABS, SHOWDOWN_POS_TABS, CONTEST_MODES } from '../utils/constants';

export default function PlayerFilters({
  contestMode,
  onContestModeChange,
  posFilter,
  onPosFilterChange,
  searchText,
  onSearchChange
}) {
  const tabs = contestMode === CONTEST_MODES.SHOWDOWN ? SHOWDOWN_POS_TABS : POS_TABS;

  return (
    <div className="card p-3 space-y-3">
      <div className="flex items-center gap-2">
        <button
          className={`tab ${contestMode === CONTEST_MODES.CLASSIC ? 'tab-active' : ''}`}
          onClick={() => onContestModeChange(CONTEST_MODES.CLASSIC)}
        >
          Classic
        </button>
        <button
          className={`tab ${contestMode === CONTEST_MODES.SHOWDOWN ? 'tab-active' : ''}`}
          onClick={() => onContestModeChange(CONTEST_MODES.SHOWDOWN)}
        >
          Showdown
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map(pos => (
            <button
              key={pos}
              className={`tab ${posFilter === pos ? 'tab-active' : ''}`}
              onClick={() => onPosFilterChange(pos)}
            >
              {pos}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <input
            className="input"
            style={{ width: '220px' }}
            placeholder="Search name/team (e.g., KC)"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

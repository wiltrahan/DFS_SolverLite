import { useState, useMemo } from 'react';
import { CONTEST_MODES, CAPTAIN_MULTIPLIER } from '../utils/constants';

export default function SavedLineups({ savedLineups, onDelete, onEdit, contestMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('title'); // 'title' or 'player'

  const lineupPlayers = (lineup) => {
    if (lineup.slots?.length) {
      return lineup.slots
        .filter(Boolean)
        .map(slot => slot.player)
        .filter(Boolean);
    }
    return lineup.players || [];
  };

  // Calculate total ownership for a lineup
  const calculateTotalOwnership = (lineup) => {
    const players = lineupPlayers(lineup);
    if (!players.length) return 0;
    return players.reduce((sum, player) => sum + (player.ownership || 0), 0);
  };

  // Filter and sort lineups
  const filteredAndSortedLineups = useMemo(() => {
    const modeLineups = savedLineups
      .map((lineup, originalIndex) => ({ ...lineup, originalIndex }))
      .filter(lineup => (lineup.contestMode || CONTEST_MODES.CLASSIC) === contestMode);
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      return [...modeLineups]
        .map((lineup) => ({
          ...lineup,
          totalOwnership: calculateTotalOwnership(lineup)
        }))
        .sort((a, b) => a.totalOwnership - b.totalOwnership);
    }

    return modeLineups
      .map((lineup) => ({
        ...lineup,
        totalOwnership: calculateTotalOwnership(lineup)
      }))
      .filter(lineup => {
        if (searchType === 'title') {
          return lineup.title.toLowerCase().includes(term);
        } else {
          // Search in player names
          return lineupPlayers(lineup).some(player => 
            player.name.toLowerCase().includes(term)
          );
        }
      })
      .sort((a, b) => a.totalOwnership - b.totalOwnership);
  }, [savedLineups, searchTerm, searchType, contestMode]);

  return (
    <div className="card p-3">
      <div className="flex justify-between items-center mb-3">
        <div className="font-semibold">Saved Lineups</div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder={`Filter by ${searchType}...`}
              className="w-48 px-3 py-1 text-sm bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="px-2 py-1 text-sm bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="title">Title</option>
            <option value="player">Player</option>
          </select>
        </div>
      </div>

      {filteredAndSortedLineups.length === 0 && savedLineups.length === 0 ? (
        <div className="muted text-sm">No saved lineups yet.</div>
      ) : filteredAndSortedLineups.length === 0 ? (
        <div className="muted text-sm">
          {searchTerm
            ? <>No lineups match <span className="text-white">"{searchTerm}"</span> in {searchType}</>
            : <>No {contestMode === CONTEST_MODES.SHOWDOWN ? 'Showdown' : 'Classic'} lineups yet.</>}
        </div>
      ) : (
        <div 
          className="saved-lineups-grid"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '16px'
          }}
        >
          {filteredAndSortedLineups.map((lineup) => (
            <div
              key={lineup.originalIndex}
              className="p-3 rounded-md"
              style={{ 
                border: '1px solid #1c2740', 
                background: '#0f1625'
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="font-semibold text-sm">
                  {lineup.title}
                </div>
                <div className="flex flex-col items-end">
                  <div className="muted text-xs">${lineup.totalSalary.toLocaleString()}</div>
                  <div className="text-xs" style={{ color: '#10b981' }}>
                    {lineup.totalOwnership.toFixed(1)}% Own
                  </div>
                </div>
              </div>
              <div className="space-y-1 mb-3">
                {(lineup.slots?.length
                  ? lineup.slots.filter(Boolean).map((slot) => ({
                      slotLabel: slot.isCaptain ? 'CPT' : 'FLEX',
                      player: slot.player,
                      salary: slot.isCaptain
                        ? Math.round(slot.player.salary * CAPTAIN_MULTIPLIER)
                        : slot.player.salary
                    }))
                  : (lineup.players || []).map((player, i) => ({
                      slotLabel: i === 0 && (lineup.contestMode || CONTEST_MODES.CLASSIC) === CONTEST_MODES.SHOWDOWN ? 'CPT' : player.position,
                      player,
                      salary: i === 0 && (lineup.contestMode || CONTEST_MODES.CLASSIC) === CONTEST_MODES.SHOWDOWN
                        ? Math.round(player.salary * CAPTAIN_MULTIPLIER)
                        : player.salary
                    }))).map((entry, i) => (
                  <div key={i} className="nowrap" style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {entry.slotLabel} • {entry.player.name} • {entry.player.team} • ${entry.salary.toLocaleString()}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  className="btn" 
                  style={{ fontSize: '12px', padding: '4px 12px' }}
                  onClick={() => onEdit(lineup.originalIndex)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger" 
                  style={{ fontSize: '12px', padding: '4px 12px' }}
                  onClick={() => onDelete(lineup.originalIndex)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

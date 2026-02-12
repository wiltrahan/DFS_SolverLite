import { useState } from 'react';
import { canPlace } from '../utils/lineupValidator';
import { CAPTAIN_MULTIPLIER, CONTEST_MODES } from '../utils/constants';

export default function PlayersTable({ players, lineupSlots, onAddPlayer, contestMode }) {
  const [sortConfig, setSortConfig] = useState({ key: 'salary', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedPlayers = () => {
    const sorted = [...players];
    sorted.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortConfig.key) {
        case 'position':
          aVal = a.position;
          bVal = b.position;
          break;
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'team':
          aVal = a.team;
          bVal = b.team;
          break;
        case 'opponent':
          aVal = a.opponent || '';
          bVal = b.opponent || '';
          break;
        case 'salary':
          aVal = a.salary;
          bVal = b.salary;
          break;
        case 'ownership':
          aVal = a.ownership ?? -1;
          bVal = b.ownership ?? -1;
          break;
        default:
          return 0;
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const sortedPlayers = getSortedPlayers();

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <span style={{ opacity: 0.3, marginLeft: '4px' }}>⇅</span>;
    }
    return (
      <span style={{ marginLeft: '4px' }}>
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };
  return (
    <div className="card p-0 overflow-hidden">
      <div className="max-h-[65vh] overflow-auto">
        <table id="playersTable">
          <thead>
            <tr>
              <th 
                style={{ width: '70px', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('position')}
              >
                Pos<SortIcon columnKey="position" />
              </th>
              <th 
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('name')}
              >
                Name<SortIcon columnKey="name" />
              </th>
              <th 
                style={{ width: '70px', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('team')}
              >
                Team<SortIcon columnKey="team" />
              </th>
              <th 
                style={{ width: '70px', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('opponent')}
              >
                Opp<SortIcon columnKey="opponent" />
              </th>
              <th 
                style={{ width: '110px', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('salary')}
              >
                Salary<SortIcon columnKey="salary" />
              </th>
              <th 
                style={{ width: '80px', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort('ownership')}
              >
                Own%<SortIcon columnKey="ownership" />
              </th>
              <th style={{ width: contestMode === CONTEST_MODES.SHOWDOWN ? '190px' : '100px' }}></th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, idx) => {
              const canAddDefault = canPlace(player, lineupSlots, contestMode, 'AUTO');
              const canAddCaptain = contestMode === CONTEST_MODES.SHOWDOWN
                ? canPlace(player, lineupSlots, contestMode, 'CPT')
                : false;
              const canAddFlex = contestMode === CONTEST_MODES.SHOWDOWN
                ? canPlace(player, lineupSlots, contestMode, 'FLEX')
                : false;
              const disabled = !canAddDefault;

              const handleRowAdd = () => {
                if (contestMode === CONTEST_MODES.SHOWDOWN) {
                  if (canAddFlex) onAddPlayer(player, 'FLEX');
                  else if (canAddCaptain) onAddPlayer(player, 'CPT');
                  return;
                }
                onAddPlayer(player, 'AUTO');
              };

              return (
                <tr
                  key={idx}
                  className={disabled ? 'cursor-row disabled' : 'cursor-row'}
                  onClick={() => !disabled && handleRowAdd()}
                >
                  <td>
                    <span className="chip">{player.position}</span>
                  </td>
                  <td className="nowrap">{player.name}</td>
                  <td className="nowrap">{player.team}</td>
                  <td className="nowrap">{player.opponent || '—'}</td>
                  <td className="nowrap mono">
                    ${player.salary.toLocaleString()}
                    {contestMode === CONTEST_MODES.SHOWDOWN && (
                      <span className="muted" style={{ marginLeft: '6px' }}>
                        CPT ${Math.round(player.salary * CAPTAIN_MULTIPLIER).toLocaleString()}
                      </span>
                    )}
                  </td>
                  <td className="nowrap">{player.ownership ?? ''}</td>
                  <td>
                    {contestMode === CONTEST_MODES.SHOWDOWN ? (
                      <div className="flex items-center gap-2">
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={!canAddCaptain}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (canAddCaptain) onAddPlayer(player, 'CPT');
                          }}
                        >
                          CPT
                        </button>
                        <button
                          className="btn btn-sm"
                          disabled={!canAddFlex}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (canAddFlex) onAddPlayer(player, 'FLEX');
                          }}
                        >
                          FLEX
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-primary"
                        disabled={disabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!disabled) onAddPlayer(player, 'AUTO');
                        }}
                      >
                        Add
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="muted" style={{ padding: '8px 10px', borderTop: '1px solid #1c2740' }}>
        {contestMode === CONTEST_MODES.SHOWDOWN
          ? 'Click a row to add to FLEX. Use CPT/FLEX buttons for explicit slot choice.'
          : 'Click anywhere on a row to add.'}
      </div>
    </div>
  );
}

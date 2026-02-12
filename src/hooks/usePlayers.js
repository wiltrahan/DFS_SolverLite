import { useMemo } from 'react';
import { FLEX_POS, CONTEST_MODES } from '../utils/constants';
import { namesInLineup, playerKey } from '../utils/lineupValidator';

export function usePlayers(allPlayers, lineupSlots, posFilter, searchText, contestMode = CONTEST_MODES.CLASSIC) {
  const filteredPlayers = useMemo(() => {
    let res = allPlayers.slice();
    
    // Position filter
    if (contestMode === CONTEST_MODES.CLASSIC && posFilter !== "ALL") {
      if (posFilter === "FLEX") {
        res = res.filter(p => FLEX_POS.has(p.position));
      } else {
        res = res.filter(p => p.position === posFilter);
      }
    }
    
    // Search filter
    const q = (searchText || "").toLowerCase();
    if (q) {
      res = res.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.team.toLowerCase().includes(q)
      );
    }
    
    // Remove players already in lineup
    const names = namesInLineup(lineupSlots);
    res = res.filter(p => !names.has(playerKey(p)));
    
    // Sort by salary (descending) then name
    res.sort((a, b) => (b.salary - a.salary) || a.name.localeCompare(b.name));
    
    // Limit to 400 players for performance
    return res.slice(0, 400);
  }, [allPlayers, lineupSlots, posFilter, searchText, contestMode]);

  return filteredPlayers;
}

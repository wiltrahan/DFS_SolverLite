import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import PlayerFilters from './components/PlayerFilters';
import PlayersTable from './components/PlayersTable';
import OptimizerPanel from './components/OptimizerPanel';
import SavedLineups from './components/SavedLineups';
import OwnershipModal from './components/OwnershipModal';
import Toast from './components/Toast';
import { usePlayers } from './hooks/usePlayers';
import { usePersistedPlayers } from './hooks/usePersistedPlayers';
import { SLOT_DEF, SHOWDOWN_SLOT_DEF, CONTEST_MODES } from './utils/constants';
import {
  getLineups,
  saveLineup as saveLineupApi,
  updateLineup as updateLineupApi,
  deleteLineup as deleteLineupApi
} from './api/lineups';
import { normalizePlayers } from './utils/csvParser';
import { 
  parsePastedOwnership, 
  aliasDstFromDict, 
  parseOwnershipCSV,
  normName 
} from './utils/ownershipParser';
import { placePlayer, removeSlot, validateLineup } from './utils/lineupValidator';

function emptySlotsForMode(mode) {
  const slotDef = mode === CONTEST_MODES.SHOWDOWN ? SHOWDOWN_SLOT_DEF : SLOT_DEF;
  return Array(slotDef.length).fill(null);
}

function getErrorMessage(error, fallback) {
  if (error?.message) return `${fallback}: ${error.message}`;
  return fallback;
}

export default function App() {
  const { 
    allPlayers, 
    setAllPlayers, 
    uploadedFileName, 
    updatePlayers, 
    clearPlayers,
    getStoredMetadata 
  } = usePersistedPlayers();
  const [contestMode, setContestMode] = useState(CONTEST_MODES.CLASSIC);
  const [lineupSlots, setLineupSlots] = useState(() => emptySlotsForMode(CONTEST_MODES.CLASSIC));
  const [posFilter, setPosFilter] = useState("ALL");
  const [searchText, setSearchText] = useState("");
  const [title, setTitle] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedLineups, setSavedLineups] = useState([]);
  const [editingLineupIndex, setEditingLineupIndex] = useState(null);

  const filteredPlayers = usePlayers(allPlayers, lineupSlots, posFilter, searchText, contestMode);

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  // Show welcome message on initial load if data exists
  useEffect(() => {
    const metadata = getStoredMetadata();
    if (metadata && metadata.playerCount > 0) {
      setTimeout(() => {
        setToastMessage(`Welcome back! ${metadata.playerCount} players restored from previous session`);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    let active = true;

    const loadLineups = async () => {
      try {
        const lineups = await getLineups();
        if (!active) return;
        const normalized = (lineups || []).map(l => {
          const lineupData = l.lineupData || {};
          return {
            id: l.id,
            title: l.title,
            contestMode: (l.contestMode || CONTEST_MODES.CLASSIC).toLowerCase(),
            totalSalary: l.totalSalary,
            players: lineupData.players || [],
            slots: lineupData.slots || [],
            createdAt: l.createdAt
          };
        });
        setSavedLineups(normalized);
      } catch (error) {
        console.error('Failed to load lineups:', error);
        showToast(getErrorMessage(error, 'Failed to load saved lineups from backend'));
      }
    };

    loadLineups();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSalaryFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const { players, lastHeaders } = normalizePlayers(res.data);
        updatePlayers(players, file.name);
        setLineupSlots(emptySlotsForMode(contestMode));
        
        if (!players.length) {
          showToast("No players parsed. Columns found: " + (lastHeaders || []).join(", "));
        } else {
          showToast("Loaded " + players.length + " players (saved to browser)");
        }
      },
      error: (err) => alert("Failed to parse salaries CSV: " + err)
    });
  };

  const applyOwnership = (dict) => {
    const aliasPct = aliasDstFromDict(dict);
    for (const abbr in aliasPct) {
      dict[`dst-${abbr}`] = aliasPct[abbr];
    }

    let matched = 0;
    const updatedPlayers = allPlayers.map(p => {
      const key = normName(p.name);
      if (dict.hasOwnProperty(key)) {
        matched++;
        return { ...p, ownership: dict[key] };
      }
      if (p.position === "DST") {
        const k2 = `dst-${p.team}`;
        if (dict.hasOwnProperty(k2)) {
          matched++;
          return { ...p, ownership: dict[k2] };
        }
      }
      return p;
    });

    setAllPlayers(updatedPlayers);
    showToast("Ownership applied: " + matched + " players");
  };

  const handleOwnershipFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const dict = parseOwnershipCSV(res.data);
        applyOwnership(dict);
      },
      error: (err) => alert("Failed to parse ownership CSV: " + err)
    });
  };

  const handlePasteOwnership = (text) => {
    const dict = parsePastedOwnership(text);
    applyOwnership(dict);
    setIsModalOpen(false);
  };

  const handleContestModeChange = (nextMode) => {
    if (nextMode === contestMode) return;
    setContestMode(nextMode);
    setLineupSlots(emptySlotsForMode(nextMode));
    setPosFilter("ALL");
    setTitle("");
    setEditingLineupIndex(null);
    showToast(nextMode === CONTEST_MODES.SHOWDOWN ? "Switched to Showdown mode" : "Switched to Classic mode");
  };

  const handleAddPlayer = (player, targetSlot = 'AUTO') => {
    const newSlots = placePlayer(player, lineupSlots, contestMode, targetSlot);
    setLineupSlots(newSlots);
  };

  const handleRemoveSlot = (index) => {
    const newSlots = removeSlot(index, lineupSlots);
    setLineupSlots(newSlots);
  };

  const handleSave = async () => {
    const v = validateLineup(lineupSlots, contestMode);
    if (!v.ok) return;

    const players = lineupSlots.filter(Boolean).map(s => s.player);
    const newLineup = {
      title: title.trim() || "Untitled",
      totalSalary: v.salary,
      players,
      contestMode,
      slots: lineupSlots.map(slot =>
        slot ? { player: slot.player, isCaptain: Boolean(slot.isCaptain) } : null
      )
    };
    const payload = {
      title: newLineup.title,
      contestMode: contestMode.toUpperCase(),
      totalSalary: newLineup.totalSalary,
      lineupData: {
        players: newLineup.players,
        slots: newLineup.slots
      }
    };

    try {
      const existing = editingLineupIndex !== null ? savedLineups[editingLineupIndex] : null;
      const saved = (existing?.id != null)
        ? await updateLineupApi(existing.id, payload)
        : await saveLineupApi(payload);

      const savedUiLineup = {
        ...newLineup,
        id: saved.id,
        createdAt: saved.createdAt
      };

      if (editingLineupIndex !== null) {
        const next = [...savedLineups];
        next[editingLineupIndex] = savedUiLineup;
        setSavedLineups(next);
      } else {
        setSavedLineups([savedUiLineup, ...savedLineups]);
      }
      setEditingLineupIndex(null);
      showToast(editingLineupIndex !== null ? "Lineup updated" : "Lineup saved");
    } catch (error) {
      console.error('Failed to save lineup:', error);
      showToast(getErrorMessage(error, 'Failed to save lineup to backend'));
    }
  };

  const handleClear = () => {
    setLineupSlots(emptySlotsForMode(contestMode));
    setTitle("");
    setEditingLineupIndex(null);
  };

  const handleReset = async () => {
    if (!confirm("Clear players, lineup, and saved list?")) return;

    try {
      await Promise.all(
        savedLineups
          .filter(lineup => Boolean(lineup.id))
          .map(lineup => deleteLineupApi(lineup.id, lineup.contestMode))
      );

      clearPlayers();
      setLineupSlots(emptySlotsForMode(contestMode));
      setTitle("");
      setSearchText("");
      setPosFilter("ALL");
      setSavedLineups([]);
      showToast("All data cleared");
    } catch (error) {
      console.error('Failed to reset all data:', error);
      showToast(getErrorMessage(error, 'Failed to fully clear backend lineups'));
    }
  };

  const handleDeleteLineup = async (idx) => {
    if (!window.confirm("Are you sure you want to delete this lineup? This action cannot be undone.")) {
      return;
    }

    try {
      const lineup = savedLineups[idx];
      if (lineup?.id) {
        await deleteLineupApi(lineup.id, lineup.contestMode);
      }

      const updated = [...savedLineups];
      updated.splice(idx, 1);
      setSavedLineups(updated);

      // If we were editing this lineup, clear the editor
      if (editingLineupIndex === idx) {
        setEditingLineupIndex(null);
        handleClear();
      } else if (editingLineupIndex !== null && editingLineupIndex > idx) {
        // Adjust the editing index if a lineup before it was deleted
        setEditingLineupIndex(editingLineupIndex - 1);
      }
      showToast("Lineup deleted");
    } catch (error) {
      console.error('Failed to delete lineup:', error);
      showToast(getErrorMessage(error, 'Failed to delete lineup from backend'));
    }
  };

  const handleEditLineup = (idx) => {
    const lineup = savedLineups[idx];
    if (!lineup) return;
    const lineupMode = lineup.contestMode || CONTEST_MODES.CLASSIC;
    const slots = emptySlotsForMode(lineupMode);

    // Load saved slot structure when available to preserve Showdown captain assignments.
    if (lineup.slots?.length) {
      lineup.slots.forEach((slot, i) => {
        if (!slot || !slot.player || i >= slots.length) return;
        slots[i] = { player: slot.player, isCaptain: Boolean(slot.isCaptain) };
      });
    } else {
      (lineup.players || []).forEach((player, i) => {
        if (i >= slots.length) return;
        slots[i] = {
          player,
          isCaptain: lineupMode === CONTEST_MODES.SHOWDOWN && i === 0
        };
      });
    }

    setContestMode(lineupMode);
    setLineupSlots(slots);
    setTitle(lineup.title);
    setPosFilter("ALL");
    setEditingLineupIndex(idx);
    showToast("Lineup loaded for editing");
    
    // Scroll to top so user can see the editor
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <FileUpload
          onSalaryFileChange={handleSalaryFileChange}
          onOwnershipFileChange={handleOwnershipFileChange}
          onPasteOwnership={() => setIsModalOpen(true)}
          onReset={handleReset}
          playerCount={filteredPlayers.length}
          storedFileName={uploadedFileName}
        />

        <Toast message={toastMessage} onClose={() => setToastMessage("")} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-4">
          {/* LEFT: Players / Filters */}
          <div className="space-y-3">
            <PlayerFilters
              contestMode={contestMode}
              onContestModeChange={handleContestModeChange}
              posFilter={posFilter}
              onPosFilterChange={setPosFilter}
              searchText={searchText}
              onSearchChange={setSearchText}
            />

            <PlayersTable
              players={filteredPlayers}
              lineupSlots={lineupSlots}
              onAddPlayer={handleAddPlayer}
              contestMode={contestMode}
            />

            <SavedLineups
              savedLineups={savedLineups}
              onDelete={handleDeleteLineup}
              onEdit={handleEditLineup}
              contestMode={contestMode}
            />
          </div>

          {/* RIGHT: Optimizer / Lineup */}
          <div className="space-y-3">
            <OptimizerPanel
              lineupSlots={lineupSlots}
              onRemoveSlot={handleRemoveSlot}
              onSave={handleSave}
              onClear={handleClear}
              title={title}
              onTitleChange={setTitle}
              isEditing={editingLineupIndex !== null}
              contestMode={contestMode}
            />
          </div>
        </div>
      </div>

      <OwnershipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={handlePasteOwnership}
      />
    </div>
  );
}

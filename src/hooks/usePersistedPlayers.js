import { useState, useEffect } from 'react';

const STORAGE_KEY = 'dfs_players_data';

export function usePersistedPlayers() {
  const [allPlayers, setAllPlayers] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.players || [];
      }
    } catch (error) {
      console.error('Error loading players from localStorage:', error);
    }
    return [];
  });

  const [uploadedFileName, setUploadedFileName] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.fileName || null;
      }
    } catch (error) {
      console.error('Error loading file name from localStorage:', error);
    }
    return null;
  });

  // Save to localStorage whenever players change
  useEffect(() => {
    try {
      if (allPlayers.length > 0) {
        const data = {
          players: allPlayers,
          fileName: uploadedFileName,
          timestamp: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error saving players to localStorage:', error);
      // If we hit storage quota, clear old data
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Clearing player data.');
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, [allPlayers, uploadedFileName]);

  const updatePlayers = (players, fileName = null) => {
    setAllPlayers(players);
    setUploadedFileName(fileName);
  };

  const clearPlayers = () => {
    setAllPlayers([]);
    setUploadedFileName(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Get stored metadata
  const getStoredMetadata = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          fileName: parsed.fileName,
          timestamp: parsed.timestamp,
          playerCount: parsed.players?.length || 0
        };
      }
    } catch (error) {
      console.error('Error getting metadata:', error);
    }
    return null;
  };

  return {
    allPlayers,
    setAllPlayers,
    uploadedFileName,
    updatePlayers,
    clearPlayers,
    getStoredMetadata
  };
}

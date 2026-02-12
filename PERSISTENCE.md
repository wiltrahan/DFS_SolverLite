# Data Persistence Guide

## Overview

The DFS Solver-Lite now automatically saves your uploaded CSV data to your browser's localStorage. This means you don't need to re-upload your player salaries every time you refresh the page or close the browser.

## What Gets Saved?

### Automatically Persisted Data
- ✅ **Player salaries** - All player data from CSV uploads
- ✅ **Ownership percentages** - Applied ownership data
- ✅ **File name** - Name of the uploaded CSV file
- ✅ **Saved lineups** - All your saved lineup configurations
- ✅ **Timestamp** - When the data was last updated

### Not Persisted (Session Only)
- ❌ Current working lineup (clears on refresh)
- ❌ Position filters (resets to "ALL")
- ❌ Search text
- ❌ Editing state

## How It Works

### On CSV Upload
1. You upload a DraftKings salaries CSV file
2. Data is automatically saved to localStorage
3. File name appears below upload controls with "SAVED IN BROWSER" badge

### On Page Refresh
1. App checks localStorage for saved player data
2. If found, automatically restores all players
3. Welcome toast shows: "Welcome back! X players restored from previous session"
4. File name displays to confirm which data is loaded

### Clearing Data
Click the **"Reset"** button to:
- Clear all player data from memory
- Clear all saved lineups
- Remove data from localStorage
- Start fresh

## Storage Limitations

### Capacity
- **localStorage limit**: ~5-10MB per domain
- **Typical player pool**: ~300-500 players = ~50-100KB
- **Plenty of space** for multiple weeks of data

### What Happens If Storage Is Full?
The app includes quota error handling:
- Warning logged to console
- Data automatically cleared to free space
- User can continue normally

## Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge (10MB limit)
- ✅ Firefox (10MB limit)
- ✅ Safari (5MB limit)
- ✅ All mobile browsers

## Privacy & Security

### Data Storage
- All data is stored **locally in your browser**
- **No data sent to servers**
- **No account required**
- **No tracking**

### Data Persistence
- Data persists until you:
  - Click "Reset" button
  - Clear browser cache/data
  - Use browser's "Clear site data" feature

### Private Browsing
In incognito/private mode:
- localStorage still works during session
- Data is cleared when private window closes

## Technical Details

### Storage Key Structure
```javascript
// Player data
localStorage key: 'dfs_players_data'
{
  players: [...],      // Array of player objects
  fileName: "...",     // Original CSV filename
  timestamp: "..."     // ISO timestamp
}

// Saved lineups
localStorage key: 'dfs_saved'
[
  {
    title: "...",
    totalSalary: 49700,
    players: [...]
  },
  ...
]
```

### Custom Hook
The `usePersistedPlayers` hook manages all persistence:
- Automatic save on data changes
- Load on mount
- Error handling
- Quota management

## Tips

### Best Practices
1. **Upload new CSV weekly** when DraftKings releases new salaries
2. **Use "Reset"** before uploading new slate data
3. **Check file name** to confirm which data is loaded
4. **Multiple tabs** will share the same data (localStorage is domain-wide)

### Troubleshooting

**Data not persisting?**
- Check if browser allows localStorage
- Disable private/incognito mode
- Check browser settings for site data permissions

**Old data showing?**
- Click "Reset" to clear
- Upload fresh CSV file
- Refresh page to confirm

**Storage quota error?**
- App auto-clears on quota errors
- Manually reset if needed
- Consider clearing very old saved lineups

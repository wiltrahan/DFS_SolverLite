# Changelog

## Version 1.4.0 - Grid Layout & Ownership Sorting

### New Features

#### Grid Layout for Saved Lineups
- **3-column grid layout** for saved lineups below the player table
- **Responsive design**: 2 columns on tablets, 1 column on mobile
- **Compact cards** with optimized spacing and font sizes
- **Positioned in left column** below the player table (not in sidebar)

#### Automatic Ownership Sorting
- **Lineups automatically sorted** by total ownership percentage (lowest to highest)
- **Total ownership % displayed** on each lineup card in green
- Shows both salary cap used and total ownership %
- Helps identify low-owned contrarian lineups at a glance

#### Ownership Display
- **Total ownership %** shown next to salary on each card
- **Green color** (#10b981) for easy visibility
- **Calculated automatically** from player ownership data
- Format: "XX.X% Own"

#### Delete Confirmation
- **Confirmation dialog** before deleting a lineup
- Prevents accidental deletions
- Message: "Are you sure you want to delete this lineup? This action cannot be undone."

### Technical Changes
- Added calculateTotalOwnership function to SavedLineups component
- Implemented automatic sorting by ownership percentage
- Removed drag-and-drop functionality in favor of automatic sorting
- Added responsive CSS media queries for grid layout
- Enhanced visual styling with ownership percentage display

## Version 1.3.0 - Sortable Columns & Opponent Display

### New Features

#### Sortable Table Columns
- **Click any column header** to sort the players table
- **Sort indicators** show current sort direction (↑ ascending, ↓ descending)
- **Toggle sorting** - Click again to reverse sort order
- **Sortable columns**: Position, Name, Team, Opponent, Salary, Ownership%
- **Default sort**: Salary (highest to lowest)
- **Hover effect** on column headers for better UX

#### Enhanced Opponent Parsing
- **Opponent column** now displays in main table
- **Smart extraction** from Game Info field (e.g., "IND@MIA" → "@MIA")
- **Multiple format support**: "@OPP", "vs OPP", or direct opponent column
- **Fallback display**: Shows "—" if opponent not available

### Technical Changes
- Enhanced CSV parser to extract opponent from multiple sources
- Added sorting state management to PlayersTable component
- Improved column header styling with hover effects
- Sort icons with visual feedback

## Version 1.2.0 - Data Persistence

### New Features

#### Browser-Based Data Persistence
- **CSV data now persists across page refreshes** using localStorage
- Player salaries, teams, positions, and ownership data are automatically saved
- No need to re-upload CSV files when returning to the app
- Data persists until you click "Reset" or clear browser data

#### Visual Indicators
- File name displayed under upload controls when data is loaded
- "SAVED IN BROWSER" badge shows data persistence status
- Welcome toast notification when returning with saved data
- Shows player count restored from previous session

#### Storage Features
- Automatic save on CSV upload
- Ownership data preserved with player data
- Timestamp tracking for loaded data
- Storage quota error handling
- Clean reset functionality clears all persisted data

### Technical Implementation
- Created `usePersistedPlayers` custom hook for localStorage management
- Stores player data, file name, and timestamp
- Handles storage quota errors gracefully
- Approximately 5-10MB storage capacity (sufficient for typical player pools)

## Version 1.1.0 - Edit Lineup Feature

### New Features

#### Edit Saved Lineups
- Added "Edit" button next to each saved lineup's "Delete" button
- Click "Edit" to load a saved lineup back into the optimizer for modification
- The lineup title is automatically populated in the title input field
- Visual indicator shows "EDITING" badge in the Optimizer panel when editing
- Save button changes to "Update" when editing a lineup
- After updating, the existing lineup is replaced (not duplicated)

#### Enhanced Title Management
- Title input field works for both new and edited lineups
- Default title "Untitled" is applied if no title is provided
- Title is preserved when editing existing lineups
- Title can be changed while editing

### User Experience Improvements
- Auto-scroll to top when clicking "Edit" so the optimizer is visible
- Toast notification confirms "Lineup loaded for editing"
- Toast notification confirms "Lineup updated" vs "Lineup saved"
- Clearing a lineup also clears the editing state
- Deleting a lineup being edited automatically clears the editor

### Technical Changes
- Added `editingLineupIndex` state to track which lineup is being edited
- Enhanced `handleSave` to update existing lineup when editing
- Added `handleEditLineup` function to load lineup into editor
- Updated `OptimizerPanel` component with `isEditing` prop
- Updated `SavedLineups` component with `onEdit` handler

export default function FileUpload({ 
  onSalaryFileChange, 
  onOwnershipFileChange, 
  onPasteOwnership, 
  onReset, 
  playerCount,
  storedFileName
}) {
  return (
    <div className="card p-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="chip">Salaries CSV</span>
          <input 
            type="file" 
            accept=".csv" 
            className="text-sm" 
            onChange={onSalaryFileChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="chip">Ownership CSV (optional)</span>
          <input 
            type="file" 
            accept=".csv" 
            className="text-sm" 
            onChange={onOwnershipFileChange}
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="chip chip-lime">Players: {playerCount}</span>
          <button className="btn" onClick={onPasteOwnership}>
            Paste Ownership
          </button>
          <button className="btn" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>
      {storedFileName && (
        <div className="mt-2 text-xs muted flex items-center gap-2">
          <span>📁</span>
          <span>Loaded: <strong>{storedFileName}</strong></span>
          <span className="chip chip-lime" style={{ fontSize: '9px' }}>SAVED IN BROWSER</span>
        </div>
      )}
    </div>
  );
}

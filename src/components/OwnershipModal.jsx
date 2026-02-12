import { useState } from 'react';

export default function OwnershipModal({ isOpen, onClose, onApply }) {
  const [text, setText] = useState('');

  const handleApply = () => {
    onApply(text);
    setText('');
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: 'min(900px,92vw)', padding: '16px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold">Paste Ownership</div>
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="muted mb-2">
          Paste rows like: <code>Ja'Marr Chase — 24.7%</code> or <code>Ja'Marr Chase,24.7%</code>. 
          Any extra columns are fine.
        </div>
        <textarea
          placeholder="Paste ownership table here..."
          style={{
            width: '100%',
            minHeight: '300px',
            border: '1px solid #334155',
            background: '#0b1220',
            color: '#e5e7eb',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '13px'
          }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex items-center gap-2 mt-2">
          <button className="btn btn-primary" onClick={handleApply}>
            Parse & Apply
          </button>
        </div>
      </div>
    </div>
  );
}

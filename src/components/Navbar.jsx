export default function Navbar() {
  return (
    <div style={{ borderBottom: '1px solid #1c2740', background: '#0a101caa', backdropFilter: 'blur(6px)' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div style={{ color: '#84cc16', fontWeight: 900, letterSpacing: '.02em' }}>
            WillyT23 Milly Machine
          </div>
          {/* <div className="chip chip-lime">I love Jaxson Dart</div> */}
        </div>
      </div>
    </div>
  );
}

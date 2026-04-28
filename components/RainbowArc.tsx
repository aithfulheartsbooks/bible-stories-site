export default function RainbowArc() {
  return (
    <svg
      className="absolute left-1/2 top-4 h-28 w-64 -translate-x-1/2 opacity-0 animate-fade-up sm:h-36 sm:w-72"
      viewBox="0 0 280 140"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 20 130 A 120 120 0 0 1 260 130" stroke="#f4a261" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M 30 130 A 110 110 0 0 1 250 130" stroke="#f7c59f" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M 40 130 A 100 100 0 0 1 240 130" stroke="#fff3b0" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M 50 130 A 90 90 0 0 1 230 130" stroke="#b8d8ba" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M 60 130 A 80 80 0 0 1 220 130" stroke="#a4c3e1" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.85" />
      <path d="M 70 130 A 70 70 0 0 1 210 130" stroke="#c9a8d4" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.85" />
    </svg>
  );
}

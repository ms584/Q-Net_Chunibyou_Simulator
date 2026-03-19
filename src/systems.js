// Shared destination data used across all components
export const SYSTEMS = {
  MARS: {
    key: 'MARS',
    name: 'Mars',
    subtitle: 'NODE-B // SOL SYSTEM',
    dist: '22 light-min',
    handshake: '44 min',
    handshakeSec: 44 * 60,        // seconds, used for display logic
    unit: 'min',
    colorHex: '#f97316',           // orange-500
    glowHex: 'rgba(249,115,22,0.5)',
    tailwind: 'text-orange-400',
    borderTw: 'border-orange-500',
    isInterstellar: false,
  },
  PROXIMA: {
    key: 'PROXIMA',
    name: 'Proxima Centauri',
    subtitle: 'NODE-C // ALPHA CEN SYSTEM',
    dist: '4.24 ly',
    handshake: '8.48 years',
    handshakeSec: 8.48 * 365.25 * 24 * 3600,
    unit: 'yr',
    colorHex: '#e879f9',           // fuchsia-400
    glowHex: 'rgba(232,121,249,0.5)',
    tailwind: 'text-fuchsia-400',
    borderTw: 'border-fuchsia-500',
    isInterstellar: true,
  },
  ALPHA: {
    key: 'ALPHA',
    name: 'Alpha Centauri',
    subtitle: 'NODE-D // BINARY G+K PAIR',
    dist: '4.37 ly',
    handshake: '8.74 years',
    handshakeSec: 8.74 * 365.25 * 24 * 3600,
    unit: 'yr',
    colorHex: '#fde047',           // yellow-300
    glowHex: 'rgba(253,224,71,0.5)',
    tailwind: 'text-yellow-300',
    borderTw: 'border-yellow-400',
    isInterstellar: true,
  },
  SIRIUS: {
    key: 'SIRIUS',
    name: 'Sirius',
    subtitle: 'NODE-E // CANIS MAJOR',
    dist: '8.60 ly',
    handshake: '17.2 years',
    handshakeSec: 17.2 * 365.25 * 24 * 3600,
    unit: 'yr',
    colorHex: '#67e8f9',           // cyan-300
    glowHex: 'rgba(103,232,249,0.5)',
    tailwind: 'text-cyan-300',
    borderTw: 'border-cyan-400',
    isInterstellar: true,
  },
};

const MAP = {
  white: '#F5F4EF', 'off-white': '#F1EADA', ivory: '#F4EDDC', 'sky blue': '#A9C6DE',
  charcoal: '#3A3A3A', indigo: '#2F3A63', black: '#1D1B1A', 'pastel pink': '#EBC7C7',
  emerald: '#2F6B4F', 'ruby red': '#8E2A2A', blush: '#E8C9C0', navy: '#1D2A4D',
  mustard: '#C99A2E', wine: '#5E2331', 'forest green': '#2E4A34', 'grey melange': '#9C9890',
  champagne: '#D9C79E', teal: '#2E6664',
};
export default function swatchColor(name) {
  return MAP[name?.toLowerCase()] || '#C9C2AE';
}

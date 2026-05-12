export const hapticFeedback = {
  light: () => {
    if ('vibrate' in navigator) navigator.vibrate(10);
  },
  medium: () => {
    if ('vibrate' in navigator) navigator.vibrate(20);
  },
  success: () => {
    if ('vibrate' in navigator) navigator.vibrate([15, 30, 15]);
  },
  error: () => {
    if ('vibrate' in navigator) navigator.vibrate([50, 100, 50, 100]);
  },
  click: () => {
    if ('vibrate' in navigator) navigator.vibrate(5);
  }
};

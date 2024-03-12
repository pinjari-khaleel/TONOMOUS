export default function setViewportCustomProperties(): void {
  document.documentElement.style.setProperty('--vh', `${innerHeight * 0.01}px`);
}

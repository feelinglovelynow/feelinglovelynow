export default function getFooter (): string {
  return `
    <div style="color: #273142; width: 100%; text-align: center; margin-top: 9px;">🌟 Intention: Good of all, please!</div>
    <div style="height: 0px; width: 0px; overflow: hidden;">
      <div style="display: none;">${ crypto.randomUUID() }</div>
    </div>
  `
}

export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
//let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

type ShieldData = {
  currentcharge: number;
  capacity: number;
  missingcharge: number;
};
const shielddata: ShieldData = {
  currentcharge: 0,
  capacity: 10,
  missingcharge: 10,
};

class ShieldListener extends EventTarget {
  constructor() {
    super();
  }

  triggerEvent(dometer: boolean, doinspect: boolean) {
    if (dometer) {
      const event = new CustomEvent("shieldChanged", {});
      this.dispatchEvent(event);
    }
    if (doinspect) {
      const event = new CustomEvent("inspection", {});
      this.dispatchEvent(event);
    }
  }
}

const shieldlisten = new ShieldListener();
shieldlisten.addEventListener("shieldChanged", (event) => {
  drawMeter();
});
shieldlisten.addEventListener("inspection", (event) => {
  renderStats();
});
shieldlisten.triggerEvent(true, false);

function drawMeter() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 10; i++) {
    ctx.fillStyle = i < shielddata.currentcharge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${shielddata.currentcharge} / 10 Total Charge`, 12, 100);
}

function updateStats() {
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  shieldlisten.triggerEvent(false, true);
}

function renderStats() {
  if (!panel) return;
  panel.textContent =
    `Current charge: ${shielddata.currentcharge} · Missing charge: ${shielddata.missingcharge}`;
}

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(10, next));
  if (bounded === shielddata.currentcharge) return;
  shielddata.currentcharge = bounded;
  shielddata.missingcharge = 10 - bounded;
  shieldlisten.triggerEvent(true, false);
  if (panel) updateStats();
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(shielddata.currentcharge - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(shielddata.currentcharge + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  shieldlisten.triggerEvent(false, true);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
};
shieldlisten.triggerEvent(true, false);

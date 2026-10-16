export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let numofproducers = 2;

interface shift_result {
  production: number;
  consumption: number;
  balance: number;
}
const shiftresults = { production: 0, consumption: 0, balance: 0 };

function calculateValues(shiftres: shift_result) {
  shiftres.production = numofproducers * 3;
  shiftres.consumption = 6;
  shiftres.balance = shiftres.production - shiftres.consumption;
}

function updateDisplay(shiftres: shift_result) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = i < numofproducers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < numofproducers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${numofproducers} / 6`, 18, 76);

  if (shiftresults.production >= shiftres.consumption) { //production first order
    drawRow(
      `Production: ${shiftresults.production}`,
      18,
      102,
      "#27766b",
      18,
      110,
      shiftres.production * 14,
    );
    ctx.fillStyle = "#233e43";
    drawRow(
      `Consumption: ${shiftres.consumption}`,
      18,
      154,
      "#a44d23",
      18,
      162,
      shiftres.consumption * 14,
    );
  } else { //consumption first order
    drawRow(
      `Production: ${shiftresults.production}`,
      18,
      154,
      "#27766b",
      18,
      162,
      shiftres.production * 14,
    );
    ctx.fillStyle = "#233e43";
    drawRow(
      `Consumption: ${shiftres.consumption}`,
      18,
      102,
      "#a44d23",
      18,
      110,
      shiftres.consumption * 14,
    );
  }

  readout.textContent =
    `Assigned: ${numofproducers}/6 · Production: ${shiftres.production} · Consumption: ${shiftres.consumption} · Balance: ${
      shiftres.balance > 0 ? "+" : ""
    }${shiftres.balance}`;
}

function drawRow(
  textcontext: string,
  textposx: number,
  textposy: number,
  fillstyle: string,
  barx: number,
  bary: number,
  barwidth: number,
) {
  ctx.fillText(textcontext, textposx, textposy);
  ctx.fillStyle = fillstyle;
  ctx.fillRect(barx, bary, barwidth, 20);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  numofproducers = Math.max(0, numofproducers - 1);
  calculateValues(shiftresults);
  updateDisplay(shiftresults);
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  numofproducers = Math.min(6, numofproducers + 1);
  calculateValues(shiftresults);
  updateDisplay(shiftresults);
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    numofproducers = 2;
    calculateValues(shiftresults);
    updateDisplay(shiftresults);
  };

calculateValues(shiftresults);
updateDisplay(shiftresults);

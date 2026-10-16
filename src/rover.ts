export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const headings = ["North", "East", "South", "West"];
let x = 2;
let y = 2;
let direction = 0;

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    headings[direction]
  }`;
}

type Command = {
  moveforward: boolean;
  turnright: boolean;
};
let storedCommands: Command[] = [];

const routePlanning = [{ newx: 0, newy: -1, dir: "up" }, {
  newx: 1,
  newy: 0,
  dir: "right",
}, {
  newx: 0,
  newy: 1,
  dir: "down",
}, { newx: -1, newy: 0, dir: "left" }];

function doCommand(newCommand: Command) {
  if (newCommand.moveforward) {
    const newx = x + routePlanning[direction].newx;
    const newy = y + routePlanning[direction].newy;
    if (newx >= 0 && newx <= 4) x = newx;
    if (newy >= 0 && newy <= 4) y = newy;
  }
  if (newCommand.turnright) {
    direction = (direction + 1) % 4;
  }
}

const commandlist = document.querySelector<HTMLButtonElement>("#command-list");
function updateCommandList() {
  let newtext = "Command List: ";
  for (let i = 0; i < storedCommands.length; i++) {
    if (storedCommands[i].moveforward) newtext += "forward, ";
    if (storedCommands[i].turnright) newtext += "right, ";
  }
  commandlist!.textContent = newtext;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  const newCommand = { moveforward: true, turnright: false };
  storedCommands.push(newCommand);
  drawRover();
  updateCommandList();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  const newCommand = { moveforward: false, turnright: true };
  storedCommands.push(newCommand);
  drawRover();
  updateCommandList();
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  storedCommands = [];
  drawRover();
  updateCommandList();
};

document.querySelector<HTMLButtonElement>("#rover-run")!.onclick = () => {
  for (let i = 0; i < storedCommands.length; i++) {
    doCommand(storedCommands[i]);
  }
  storedCommands = [];
  drawRover();
  updateCommandList();
};
document.querySelector<HTMLButtonElement>("#rover-clear")!.onclick = () => {
  storedCommands = [];
  drawRover();
  updateCommandList();
};

drawRover();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3000;

app.use(express.static(__dirname));

const CSV_PATH = path.join(__dirname, 'game_data.csv');
const TRAIT_PATH = path.join(__dirname, 'traits.csv');

let players = new Set();
let round = 1;
let csvData = [];
let gameLocked = false;
let currentBoyImages = {};
let currentTraits = { A: [], B: [], C: [] };
let traitDeck = [];
let gameOver = false;
const FINAL_ROUND = 4;


// Load trait deck once at startup
function loadTraits() {
  const raw = fs.readFileSync(TRAIT_PATH, 'utf8');
  const parsed = parse(raw, { columns: true });  // still valid
  traitDeck = parsed.map(row => row.Trait).filter(Boolean); // 🔄 Now a flat array of strings
}
loadTraits();

function writeCSV() {
  const content = csvData.map(row => row.join(',')).join('\n');
  fs.writeFileSync(CSV_PATH, content);
}

function getPlayerRow(name) {
  return csvData.find(row => row[0] === name);
}

function getHeaderIndex(headerName) {
  if (!csvData.length || !csvData[0]) return -1;
  return csvData[0].indexOf(headerName);
}

function initializeCSV() {
  const playerList = Array.from(players);
  const headers = ['Name', 'Score'];

  playerList.forEach(p => {
    for (let r = 1; r <= FINAL_ROUND; r++) {
      headers.push(`${p}_choice${r}`);
    }
  });
  

  csvData = [headers];

  playerList.forEach(p => {
    const row = [p, 0];
    const totalChoiceColumns = playerList.length * FINAL_ROUND;
    for (let i = 0; i < totalChoiceColumns; i++) {
      row.push('Z');
    }
    csvData.push(row);
  });

  writeCSV();
  io.emit('csvUpdated', csvData);
  io.emit('playerList', playerList);
}

function calculateScores(roundNum) {
  const playerList = Array.from(players);

  playerList.forEach(guesser => {
    const guesserRow = getPlayerRow(guesser);
    if (!guesserRow) return;

    let score = parseInt(guesserRow[1]) || 0;

    playerList.forEach(target => {
      if (guesser === target) return;

      const colName = `${target}_choice${roundNum}`;
      const colIndex = getHeaderIndex(colName);

      const targetRow = getPlayerRow(target);
      if (!targetRow || colIndex === -1) return;

      const actualChoice = targetRow[colIndex];
      const guessedChoice = guesserRow[colIndex];

      if (actualChoice && guessedChoice && actualChoice === guessedChoice) {
        score += 1;
      }
    });

    guesserRow[1] = score.toString();
  });

  writeCSV();
  io.emit('csvUpdated', csvData);
}

function getRandomTrait(columnName) {
  const entries = traitDeck.map(row => row[columnName]).filter(Boolean);
  return entries.length ? entries[Math.floor(Math.random() * entries.length)] : '';
}

function assignTraitsForRound(roundNum) {
  if (gameOver) return;
  if (roundNum === 1) {
    currentTraits = { A: [], B: [], C: [] };
  }

  ['A', 'B', 'C'].forEach(letter => {
    const shuffled = traitDeck.sort(() => 0.5 - Math.random());
    const trait = shuffled[0] || '';

    if (trait) currentTraits[letter].push(trait);
  });

  io.emit('traitsUpdated', currentTraits);
}


io.on('connection', (socket) => {
  console.log('A player connected');

  socket.on('buttonClicked', (label) => {
    console.log(`🖱️ clicked ${label}`);
  });

  socket.on('registerName', (name) => {
    if (!gameLocked || players.has(name)) {
      players.add(name);
      io.emit('playerList', Array.from(players));
    }
  });

  socket.on('startGame', () => {
    round = 1;
    gameLocked = true;
    fs.writeFileSync(CSV_PATH, '');
    initializeCSV();

    const imageDir = path.join(__dirname, "BF's HT");
    const allImages = fs.readdirSync(imageDir).filter(f => f.startsWith('HTBF'));
    const shuffled = allImages.sort(() => 0.5 - Math.random());
    const chosen = shuffled.slice(0, 3);

    currentBoyImages = {
      boyA: chosen[0],
      boyB: chosen[1],
      boyC: chosen[2],
    };

    io.emit('gameStarted', [chosen[0], chosen[1], chosen[2]]);
  });

  socket.on('resetGame', () => {
    players = new Set();
    gameLocked = false;
    csvData = [];
    currentBoyImages = {};
    currentTraits = { A: [], B: [], C: [] };
    gameOver = false;
    round = 1;
    fs.writeFileSync(CSV_PATH, '');
    io.emit('csvUpdated', []);
  });

  socket.on('playerChoice', ({ name, choice }) => {
    const row = getPlayerRow(name);
    if (!row) return;
    const colName = `${name}_choice${round}`;
    const idx = getHeaderIndex(colName);
    if (idx !== -1) {
      row[idx] = choice;
      writeCSV();
      io.emit('csvUpdated', csvData);
    }
      io.emit('playerChoice', { name, choice });
  });

  socket.on('playerGuesses', ({ name, guesses }) => {
    const row = getPlayerRow(name);
    if (!row) return;
    for (const target in guesses) {
      const colName = `${target}_choice${round}`;
      const idx = getHeaderIndex(colName);
      if (idx !== -1) {
        row[idx] = guesses[target];
      }
    }
    writeCSV();
    io.emit('csvUpdated', csvData);
  });

  const FINAL_ROUND = 4; // 👈 set this to whatever you want

  socket.on('advanceRound', () => {
    if (gameOver) {
      console.log('🚫 Game is already over. Ignoring extra advanceRound.');
      return;
    }
  
    console.log(`⏭️ Advancing from round ${round}...`);
    calculateScores(round);
  
    if (round < FINAL_ROUND) {
      assignTraitsForRound(round);
      round++;
      io.emit('roundAdvanced', round);
    } else {
      round++;
      io.emit('roundAdvanced', FINAL_ROUND); // show final reveal
      io.emit('gameOver');
      gameOver = true;
    }
  });
  

  socket.on('requestCSV', () => {
    socket.emit('csvUpdated', csvData);
  });
});

function logLocalIP() {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        const ip = iface.address;
        console.log(`\n🎮 Join the game via this link: http://${ip}:3000/host.html`);
        console.log(`📱 Send this one to the players: http://${ip}:3000/player.html\n`);
        return;
      }
    }
  }
}


server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  logLocalIP();
});

// HTBF 7=8 and 10=11
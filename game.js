document.addEventListener('DOMContentLoaded', () => {
  const SIZE = 4;
  let grid = [];
  let score = 0;
  let won = false;
  let gameOver = false;
  let prevGrid = [];

  const gridEl = document.getElementById('grid');
  const scoreEl = document.getElementById('score');
  const newGameBtn = document.getElementById('new-game');
  const overlay = document.getElementById('overlay');
  const overlayMsg = document.getElementById('overlay-message');
  const overlayBtn = document.getElementById('overlay-btn');

  // --- Data model ---

  function getEmptyCells() {
    const cells = [];
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === 0) cells.push({ r, c });
      }
    }
    return cells;
  }

  function addRandomTile() {
    const empty = getEmptyCells();
    if (empty.length === 0) return null;
    const cell = empty[Math.floor(Math.random() * empty.length)];
    grid[cell.r][cell.c] = Math.random() < 0.9 ? 2 : 4;
    return cell;
  }

  function copyGrid() {
    return grid.map(row => [...row]);
  }

  // --- Init & Render ---

  function initGame() {
    grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    prevGrid = [];
    score = 0;
    won = false;
    gameOver = false;
    scoreEl.textContent = score;
    overlay.classList.add('hidden');
    addRandomTile();
    addRandomTile();
    renderGrid();
  }

  function renderGrid(newTile, mergedCells) {
    gridEl.innerHTML = '';
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        const val = grid[r][c];
        if (val !== 0) {
          tile.textContent = val;
          tile.setAttribute('data-value', val);
          if (newTile && newTile.r === r && newTile.c === c) {
            tile.classList.add('tile-new');
          }
          if (mergedCells && mergedCells.some(m => m.r === r && m.c === c)) {
            tile.classList.add('tile-merged');
          }
        }
        gridEl.appendChild(tile);
      }
    }
    scoreEl.textContent = score;
  }

  // --- Slide & Merge ---

  let mergedCells = [];

  function slideRow(row, rowIdx, isCol, reversed) {
    let arr = row.filter(v => v !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        score += arr[i];
        arr[i + 1] = 0;
        const pos = reversed ? SIZE - 1 - i : i;
        if (isCol) {
          mergedCells.push({ r: pos, c: rowIdx });
        } else {
          mergedCells.push({ r: rowIdx, c: pos });
        }
        i++; // Skip next tile to prevent chain merging (Bug fix SKG-29)
      }
    }
    arr = arr.filter(v => v !== 0);
    while (arr.length < SIZE) arr.push(0);
    return arr;
  }

  function move(direction) {
    if (gameOver) return false;

    const prev = JSON.stringify(grid);
    mergedCells = [];

    if (direction === 'left') {
      for (let r = 0; r < SIZE; r++) {
        grid[r] = slideRow(grid[r], r, false, false);
      }
    } else if (direction === 'right') {
      for (let r = 0; r < SIZE; r++) {
        grid[r] = slideRow([...grid[r]].reverse(), r, false, true).reverse();
      }
    } else if (direction === 'up') {
      for (let c = 0; c < SIZE; c++) {
        const col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
        const slid = slideRow(col, c, true, false);
        for (let r = 0; r < SIZE; r++) grid[r][c] = slid[r];
      }
    } else if (direction === 'down') {
      for (let c = 0; c < SIZE; c++) {
        const col = [grid[3][c], grid[2][c], grid[1][c], grid[0][c]];
        const slid = slideRow(col, c, true, true);
        for (let r = 0; r < SIZE; r++) grid[r][c] = slid[SIZE - 1 - r];
      }
    }

    const changed = JSON.stringify(grid) !== prev;
    if (changed) {
      const newTile = addRandomTile();
      renderGrid(newTile, mergedCells);
      checkWin();
      checkGameOver();
    }
    return changed;
  }

  // --- Win detection ---

  function checkWin() {
    if (won) return;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] === 2048) {
          won = true;
          overlayMsg.textContent = 'You Win!';
          overlay.classList.remove('hidden');
          return;
        }
      }
    }
  }

  // --- Game over detection ---

  function isGameOver() {
    if (getEmptyCells().length > 0) return false;
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const val = grid[r][c];
        if (c < SIZE - 1 && val === grid[r][c + 1]) return false;
        if (r < SIZE - 1 && val === grid[r + 1][c]) return false;
      }
    }
    return true;
  }

  function checkGameOver() {
    if (isGameOver()) {
      gameOver = true;
      overlayMsg.textContent = 'Game Over';
      overlay.classList.remove('hidden');
    }
  }

  // --- Keyboard controls ---

  document.addEventListener('keydown', (e) => {
    const keyMap = {
      ArrowLeft: 'left',
      ArrowRight: 'right',
      ArrowUp: 'up',
      ArrowDown: 'down',
    };
    if (keyMap[e.key]) {
      e.preventDefault();
      move(keyMap[e.key]);
    }
  });

  // --- Issue #12 (SKG-27): Touch controls ---

  let touchStartX = 0;
  let touchStartY = 0;

  gridEl.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  gridEl.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const threshold = 50;

    if (Math.max(absDx, absDy) < threshold) return;

    if (absDx > absDy) {
      move(dx > 0 ? 'right' : 'left');
    } else {
      move(dy > 0 ? 'down' : 'up');
    }
  }, { passive: true });

  // --- Buttons ---

  newGameBtn.addEventListener('click', initGame);
  overlayBtn.addEventListener('click', initGame);

  initGame();
});

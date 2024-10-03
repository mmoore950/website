// script.js

const visualizers = {
  bubbleSort: createVisualizer('bubbleContainer', bubbleSort),
  selectionSort: createVisualizer('selectionContainer', selectionSort),
  insertionSort: createVisualizer('insertionContainer', insertionSort),
};

function createVisualizer(containerId, sortingAlgorithm) {
  return {
    array: [],
    moves: [],
    n: 10,
    container: document.getElementById(containerId),

    init: function() {
      this.array = [];
      for (let i = 0; i < this.n; i++) {
        this.array.push(Math.random());
      }
      this.showBars();
    },

    play: function() {
      const arrayCopy = [...this.array];
      this.moves = sortingAlgorithm(arrayCopy);
      this.animate();
    },

    animate: function() {
      if (this.moves.length === 0) {
        this.showBars();
        return;
      }
      const move = this.moves.shift();
      const [i, j] = move.indices;

      if (move.type === 'swap') {
        let tmp = this.array[i];
        this.array[i] = this.array[j];
        this.array[j] = tmp;
      }
      this.showBars(move);
      setTimeout(() => this.animate(), 50);
    },

    showBars: function(move) {
      this.container.innerHTML = ''; // Corrected assignment operator
      for (let i = 0; i < this.array.length; i++) {
        const bar = document.createElement('div');
        bar.style.height = this.array[i] * 100 + '%';
        bar.classList.add('bar');

        if (move && move.indices.includes(i)) {
          if (move.type === 'swap') {
            bar.style.backgroundColor = 'red';
          } else if (move.type === 'comp') {
            bar.style.backgroundColor = 'blue';
          } else if (move.type === 'select') {
            bar.style.backgroundColor = 'green';
          }
        }
        this.container.appendChild(bar);
      }
    },
  };
}

function bubbleSort(array) {
  const moves = [];
  let swapped;
  do {
    swapped = false;
    for (let i = 1; i < array.length; i++) {
      moves.push({ indices: [i - 1, i], type: 'comp' });
      if (array[i - 1] > array[i]) {
        swapped = true;
        moves.push({ indices: [i - 1, i], type: 'swap' });
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
      }
    }
  } while (swapped);
  return moves;
}

function selectionSort(array) {
  const moves = [];
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    moves.push({ indices: [i], type: 'select' });
    for (let j = i + 1; j < n; j++) {
      moves.push({ indices: [j], type: 'comp' });
      if (array[j] < array[minIndex]) {
        minIndex = j;
        moves.push({ indices: [minIndex], type: 'select' });
      }
    }
    if (minIndex !== i) {
      moves.push({ indices: [i, minIndex], type: 'swap' });
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }
  return moves;
}

function insertionSort(array) {
  const moves = [];
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    moves.push({ indices: [i], type: 'select' });
    while (j >= 0 && array[j] > key) {
      moves.push({ indices: [j, j + 1], type: 'comp' });
      array[j + 1] = array[j];
      moves.push({ indices: [j, j + 1], type: 'swap' });
      j--;
    }
    array[j + 1] = key;
  }
  return moves;
}

// Initialize all visualizers
for (const key in visualizers) {
  if (visualizers.hasOwnProperty(key)) {
    visualizers[key].init();
  }
}

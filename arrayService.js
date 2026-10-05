// Array data structure state & algorithms service for ArrayLab
// Comprehensive backend handling simulation state, memory mapping, AI tutor, and viva questions.

const MAX_SIZE = 12; // Maximum array capacity (matches frontend limit)
const BASE_ADDRESS = 1000;
const ELEMENT_SIZE = 4; // Bytes per integer

class ArrayService {
  constructor(initialArray = [10, 20, 30, 40, 50]) {
    this.initialSnapshot = [...initialArray];
    this.arr = [...initialArray];
    this.history = ['Array initialized with [10, 20, 30, 40, 50]'];
  }

  addHistory(entry) {
    this.history.unshift(entry);
    if (this.history.length > 20) {
      this.history.pop();
    }
  }

  getHistory() {
    return [...this.history];
  }

  getState() {
    const memory = this.arr.map((val, idx) => ({
      index: idx,
      value: val,
      address: BASE_ADDRESS + (idx * ELEMENT_SIZE)
    }));

    return {
      array: [...this.arr],
      size: this.arr.length,
      maxSize: MAX_SIZE,
      baseAddress: BASE_ADDRESS,
      elementSize: ELEMENT_SIZE,
      memory,
      history: this.getHistory()
    };
  }

  reset() {
    this.arr = [...this.initialSnapshot];
    const log = 'Array reset to initial state [10, 20, 30, 40, 50]';
    this.addHistory(log);

    return {
      operation: 'Reset',
      success: true,
      message: 'Array restored to [10, 20, 30, 40, 50].',
      steps: [
        'The array is restored to its starting values.',
        'Memory addresses recalculated from base 1000.',
        'Highlights and history are cleared.'
      ],
      ...this.getState()
    };
  }

  insert(val, pos) {
    const value = parseInt(val, 10);
    const position = parseInt(pos, 10);

    if (isNaN(value)) throw new Error('Please enter a valid numeric value.');
    if (isNaN(position)) throw new Error('Please enter a valid position index.');
    if (this.arr.length >= MAX_SIZE) {
      throw new Error(`Array Overflow! Maximum capacity of ${MAX_SIZE} elements reached.`);
    }
    if (position < 0 || position > this.arr.length) {
      throw new Error(`Invalid position: must be between 0 and ${this.arr.length}.`);
    }

    const steps = [
      `Check capacity: current size ${this.arr.length} < max capacity ${MAX_SIZE}.`,
      `Validate index: 0 <= position ${position} <= current size ${this.arr.length}.`
    ];

    if (position < this.arr.length) {
      const shiftedCount = this.arr.length - position;
      steps.push(`Shift ${shiftedCount} element(s) from index ${this.arr.length - 1} down to ${position} rightward.`);
    } else {
      steps.push(`Appending directly at the end (index ${position}). No shifting required.`);
    }

    this.arr.splice(position, 0, value);
    steps.push(`Place ${value} into A[${position}] (Address: ${BASE_ADDRESS + position * ELEMENT_SIZE}).`);
    steps.push(`Array size increased to ${this.arr.length}.`);

    const log = `Inserted ${value} at index ${position}`;
    this.addHistory(log);

    return {
      operation: 'Insert',
      success: true,
      insertedValue: value,
      insertedPosition: position,
      message: `Inserted ${value} at index ${position}.`,
      steps,
      ...this.getState()
    };
  }

  delete(pos) {
    const position = parseInt(pos, 10);
    if (isNaN(position)) throw new Error('Please enter a valid position index.');
    if (this.arr.length === 0) throw new Error('Array Underflow! Cannot delete from an empty array.');
    if (position < 0 || position >= this.arr.length) {
      throw new Error(`Invalid position: must be between 0 and ${this.arr.length - 1}.`);
    }

    const removedValue = this.arr[position];
    const steps = [
      `Validate index: 0 <= position ${position} < current size ${this.arr.length}.`,
      `Read value ${removedValue} stored at A[${position}] (Address: ${BASE_ADDRESS + position * ELEMENT_SIZE}).`
    ];

    const shiftedCount = this.arr.length - 1 - position;
    if (shiftedCount > 0) {
      steps.push(`Shift ${shiftedCount} element(s) from index ${position + 1} up to ${this.arr.length - 1} leftward to fill the gap.`);
    } else {
      steps.push('Deleting the last element: no elements needed to be shifted.');
    }

    this.arr.splice(position, 1);
    steps.push(`Array size decreased to ${this.arr.length}.`);

    const log = `Deleted ${removedValue} from index ${position}`;
    this.addHistory(log);

    return {
      operation: 'Delete',
      success: true,
      deletedValue: removedValue,
      deletedPosition: position,
      message: `Deleted element ${removedValue} from index ${position}.`,
      steps,
      ...this.getState()
    };
  }

  update(pos, val) {
    const position = parseInt(pos, 10);
    const value = parseInt(val, 10);
    if (isNaN(position)) throw new Error('Please enter a valid position index.');
    if (isNaN(value)) throw new Error('Please enter a valid numeric value.');
    if (position < 0 || position >= this.arr.length) {
      throw new Error(`Invalid position: must be between 0 and ${this.arr.length - 1}.`);
    }

    const oldValue = this.arr[position];
    this.arr[position] = value;

    const steps = [
      `Calculate memory address: ${BASE_ADDRESS} + (${position} * ${ELEMENT_SIZE}) = ${BASE_ADDRESS + position * ELEMENT_SIZE}.`,
      `Perform direct O(1) random-access write to index ${position}.`,
      `Overwrote previous value ${oldValue} with new value ${value}.`
    ];

    const log = `Updated index ${position} from ${oldValue} to ${value}`;
    this.addHistory(log);

    return {
      operation: 'Update',
      success: true,
      oldValue,
      newValue: value,
      position,
      message: `Updated index ${position} to ${value}.`,
      steps,
      ...this.getState()
    };
  }

  search(val) {
    const value = parseInt(val, 10);
    if (isNaN(value)) throw new Error('Please enter a valid number to search.');

    const steps = [
      `Initiate Linear Search for target ${value} starting at index 0.`
    ];
    let foundIndex = -1;

    for (let i = 0; i < this.arr.length; i++) {
      steps.push(`Compare A[${i}] (${this.arr[i]}) with ${value} at address ${BASE_ADDRESS + i * ELEMENT_SIZE}.`);
      if (this.arr[i] === value) {
        foundIndex = i;
        steps.push(`Match found at index ${i}! Linear search terminates early.`);
        break;
      }
    }

    if (foundIndex === -1) {
      steps.push(`Reached end of array. All ${this.arr.length} element(s) compared without a match. Returns -1.`);
    }

    const log = `Searched for ${value} (${foundIndex === -1 ? 'not found' : 'found at index ' + foundIndex})`;
    this.addHistory(log);

    return {
      operation: 'Search',
      success: foundIndex !== -1,
      targetValue: value,
      foundIndex,
      comparisons: foundIndex === -1 ? this.arr.length : foundIndex + 1,
      message: foundIndex !== -1 ? `${value} found at index ${foundIndex}.` : `Element ${value} not found in array.`,
      steps,
      ...this.getState()
    };
  }

  sort() {
    const before = [...this.arr];
    this.arr.sort((a, b) => a - b);
    const same = before.join(',') === this.arr.join(',');

    const steps = [
      'Compare adjacent elements numerically.',
      'Arrange all values in ascending order (smallest to largest).',
      same ? 'The array was already in sorted order.' : `Rearranged from [${before.join(', ')}] to [${this.arr.join(', ')}].`
    ];

    const log = 'Sorted array ascending';
    this.addHistory(log);

    return {
      operation: 'Sort',
      success: true,
      message: same ? 'Array was already sorted.' : 'Array sorted in ascending order.',
      steps,
      ...this.getState()
    };
  }

  reverse() {
    const before = [...this.arr];
    for (let i = 0; i < Math.floor(this.arr.length / 2); i++) {
      const j = this.arr.length - 1 - i;
      const temp = this.arr[i];
      this.arr[i] = this.arr[j];
      this.arr[j] = temp;
    }

    const steps = [
      'Swap the first element with the last element.',
      'Move inward symmetrically and swap the next inner pair.',
      'Stop when reaching the center pivot of the array. Time: O(n/2) = O(n).'
    ];

    const log = 'Reversed the array';
    this.addHistory(log);

    return {
      operation: 'Reverse',
      success: true,
      message: this.arr.length <= 1 ? 'Array has <= 1 element.' : 'Array reversed successfully.',
      steps,
      ...this.getState()
    };
  }

  traverse() {
    const steps = [
      'Start traversal from index 0.',
      ...this.arr.map((val, idx) => `Visit index ${idx}: Value = ${val} (Address: ${BASE_ADDRESS + idx * ELEMENT_SIZE})`),
      `Completed visiting all ${this.arr.length} elements in O(n) linear time.`
    ];

    const log = 'Traversed the array';
    this.addHistory(log);

    return {
      operation: 'Traverse',
      success: true,
      message: `All ${this.arr.length} elements visited.`,
      steps,
      ...this.getState()
    };
  }
}

// Built-in AI Study Assistant Knowledge Base (enriched with both conceptual and exam-ready topics)
const TUTOR_QA = [
  {
    keywords: ['what is an array', 'define', 'array'],
    answer: 'An array is a linear data structure used to store elements of the same data type in contiguous memory locations. Each element is accessed using an index starting from 0.'
  },
  {
    keywords: ['o(1)', 'access', 'random access', 'formula'],
    answer: 'Array elements are stored contiguously, so the address of A[i] = Base Address + (i x Element Size). One simple mathematical calculation gives the location directly, no matter how big the array is. That is why access is O(1).'
  },
  {
    keywords: ['insertion', 'insert', 'add'],
    answer: 'To insert at an index, the elements from that index onward are shifted one position right to make space. Then the new value is placed and the size increases by 1. Shifting makes it O(n) in the worst case.'
  },
  {
    keywords: ['deletion', 'delete', 'remove'],
    answer: 'After deleting an element, all elements after it must shift one place left to fill the gap. In the worst case (deleting the first element) n-1 elements move, so deletion takes O(n).'
  },
  {
    keywords: ['linear search', 'search'],
    answer: 'Linear search checks elements one by one from index 0 until the key is found or the array ends. Best case O(1), average and worst case O(n). It works on unsorted arrays.'
  },
  {
    keywords: ['traversal', 'traverse', 'visit'],
    answer: 'Traversal means visiting every element of the array exactly once, usually with a loop from index 0 to n-1. It takes O(n) time.'
  },
  {
    keywords: ['zero', 'index start', '0-based', 'offset'],
    answer: 'The index is the offset (distance) from the base address. The first element is 0 positions away from the start, so its index is 0.'
  },
  {
    keywords: ['complexity', 'time', 'big o'],
    answer: 'Time Complexities: Access O(1). Search O(n). Insert O(n) (due to shifting). Delete O(n) (due to shifting). Traversal O(n).'
  },
  {
    keywords: ['linked list', 'vs linked', 'difference'],
    answer: 'Array: fixed size, contiguous memory, O(1) access by index, slow insert/delete in the middle. Linked list: dynamic size, nodes joined by pointers, access needs O(n) traversal, but insertion/deletion is easy once the node pointer is known.'
  },
  {
    keywords: ['contiguous', 'memory'],
    answer: 'Contiguous memory means consecutive byte addresses in RAM without gaps. This enables direct mathematical address calculation and excellent CPU cache performance.'
  },
  {
    keywords: ['overflow'],
    answer: 'Array overflow occurs when attempting to insert an element into an array that has already filled its allocated capacity (max size reached).'
  },
  {
    keywords: ['underflow'],
    answer: 'Array underflow occurs when attempting to delete an element from an array that is currently empty (size = 0).'
  }
];

function answerTutorQuestion(question) {
  if (!question || !question.trim()) {
    return 'Please enter a question about data structures or arrays.';
  }
  const q = question.toLowerCase();

  let bestMatch = null;
  let highestScore = 0;

  for (const item of TUTOR_QA) {
    let score = 0;
    for (const k of item.keywords) {
      if (q.includes(k)) {
        // Longer matching keywords give higher weight
        score += k.length * 2;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  if (bestMatch && highestScore > 0) {
    return bestMatch.answer;
  }

  return 'I can answer questions about arrays, memory addressing, contiguous storage, linear search, insertion, deletion, traversal, time complexity, and array vs linked list. (Try: "Why is array access O(1)?" or "Explain insertion in an array.")';
}

// 15 Comprehensive Viva Questions for Academic Demonstration
const VIVA_QUESTIONS = [
  {
    q: 'What is an array?',
    a: 'A linear data structure that stores elements of the same data type in contiguous memory locations.'
  },
  {
    q: 'Why does array indexing start from zero?',
    a: 'The index is the offset from the base address. The first element is at offset 0, so its index is 0.'
  },
  {
    q: 'Why is accessing an array element O(1)?',
    a: 'The address is found directly using Base Address + (Index x Element Size), so no searching or loop is needed.'
  },
  {
    q: 'What is traversal?',
    a: 'Visiting every element of the array once, usually using a loop from 0 to n-1.'
  },
  {
    q: 'What is linear search?',
    a: 'Checking elements one by one from the start until the required value is found or the array ends.'
  },
  {
    q: 'What is the time complexity of linear search?',
    a: 'Best case O(1) (found at index 0), average and worst case O(n).'
  },
  {
    q: 'Why does insertion take O(n)?',
    a: 'Elements after the position must be shifted right to make space, and in the worst case (inserting at index 0) all n elements move.'
  },
  {
    q: 'Why does deletion take O(n)?',
    a: 'Elements after the deleted position must be shifted left to close the gap, which can take up to n-1 shifts.'
  },
  {
    q: 'What is the difference between an array and a linked list?',
    a: 'An array uses contiguous memory with fast index access. A linked list uses nodes connected by pointers, so it grows easily but access is O(n).'
  },
  {
    q: 'What technologies did you use to create this project?',
    a: 'HTML5 for structure, CSS3 with cyber-neon aesthetics for styling, Node.js + Express for the REST API backend, and JavaScript for client-server synchronization.'
  },
  {
    q: 'Why did you build an Express backend for this practical?',
    a: 'The backend handles state persistence, input validation, memory address calculation, algorithmic step logs, and powers the AI study tutor & viva API.'
  },
  {
    q: 'How does your search operation work?',
    a: 'It sends a request to the backend /api/array/search endpoint, which compares each element sequentially, logs comparison count, and returns the match index.'
  },
  {
    q: 'How did you implement array visualization?',
    a: 'The frontend receives the live array state and memory mappings from the backend and dynamically renders animated DOM cells with color-coded status highlights.'
  },
  {
    q: 'What happens when an element is inserted?',
    a: 'The backend validates boundary limits, shifts trailing elements rightward in memory, stores the value, recalculates memory addresses, and returns step-by-step logs.'
  },
  {
    q: 'What are the limitations of arrays?',
    a: 'Fixed size in traditional static arrays, costly insertion and deletion due to element shifting, and slow O(n) search on unsorted data.'
  }
];

module.exports = {
  ArrayService,
  answerTutorQuestion,
  TUTOR_QA,
  VIVA_QUESTIONS
};

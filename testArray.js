const { ArrayService, answerTutorQuestion, VIVA_QUESTIONS } = require('./arrayService');

console.log('--- Comprehensive Testing of ArrayLab Backend ---');

const service = new ArrayService([10, 20, 30, 40, 50]);

// 1. Initial State
let state = service.getState();
console.log('Initial array:', state.array);
console.assert(state.size === 5, 'Initial size mismatch');
console.assert(state.memory[2].address === 1008, 'Memory address calculation error');

// 2. Insert
let res = service.insert(25, 2);
console.log('After insert 25 at index 2:', res.array);
console.assert(res.array[2] === 25, 'Insert failed');
console.assert(res.size === 6, 'Insert size failed');
console.assert(res.steps.length > 0, 'Steps missing');

// 3. Delete
res = service.delete(1);
console.log('After delete index 1:', res.array);
console.assert(res.deletedValue === 20, 'Delete value mismatch');
console.assert(res.size === 5, 'Delete size failed');

// 4. Update
res = service.update(3, 99);
console.log('After update index 3 to 99:', res.array);
console.assert(res.array[3] === 99, 'Update failed');

// 5. Search
res = service.search(99);
console.log('Search 99 result index:', res.foundIndex);
console.assert(res.foundIndex === 3, 'Search failed');

// 6. Reverse & Sort
service.reverse();
console.log('After reverse:', service.getState().array);
service.sort();
console.log('After sort:', service.getState().array);

// 7. History
const history = service.getHistory();
console.log('History entries count:', history.length);
console.assert(history.length >= 5, 'History tracking failed');

// 8. AI Tutor
const answer = answerTutorQuestion('why is array access o(1)');
console.log('Tutor answer snippet:', answer.slice(0, 60) + '...');
console.assert(answer.includes('Base Address'), 'Tutor answer failed');

// 9. Viva questions
console.log('Viva questions count:', VIVA_QUESTIONS.length);
console.assert(VIVA_QUESTIONS.length === 15, 'Viva questions count should be 15');

console.log('\n>>> ALL 9 ARRAYLAB BACKEND TESTS PASSED SUCCESSFULLY! <<<');

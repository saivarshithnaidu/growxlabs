const bcrypt = require('bcryptjs');

const password = 'GrowXAdmin2026!';
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

console.log('Password:', password);
console.log('Hash:', hash);

// Check if it matches my previous hash
const matches = bcrypt.compareSync(password, '$2b$10$ieErAoR7OmFW2nMRVY74mezt/WH7.Hv3eBj/lV6990gA119SpwOp2');
console.log('Matches previous hash?', matches);

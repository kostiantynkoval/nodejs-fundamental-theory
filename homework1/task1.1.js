const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
});

rl.on('line', input => {
    if(input.length > 0) {
        const reversedInput = input.split('').reverse().join('');
        console.log(reversedInput, "\n");
    }
});
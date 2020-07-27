const readline = require('readline');
// import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
});

rl.on('line', input => {
    if(input.length > 0) {
        const tupni = input.split('').reverse().join('');
        console.log(tupni)
        console.log()
    }
});
import readline from "readline"
import fs from "fs"
import csvToJson from "csvtojson"

const csvFilePath = `${__dirname}/csv/homework1.csv`

const rl = readline.createInterface({
    input: process.stdin,
});

rl.on('line', input => {
    if(input.length > 0) {
        const reversedInput = input.split('').reverse().join('');
        console.log(reversedInput, "\n");
    }
});

fs.readFile(csvFilePath, (error, file) => {
    if (!error) {
        csvToJson({
            ignoreColumns: /Amount/,
            headers: ["book", "author", "price"]
        })
            .fromString(file.toString())
            .then(json => JSON.stringify(json).slice(1,-1).replace(/},{/g,"}\n{" ))
            .then((stringTable) => {
                fs.writeFile(`${__dirname}/babelefied_result_task1_2.txt`, stringTable, error => {
                    if (error) {
                        console.log("!@#$ Babelefied Error writing file: ", error)
                    } else {
                        console.log("#################### Converting Completed Babelefied ######################")
                    }
                });
            })
            .catch(error => console.log("!@#$ Error converting to JSON: ", error))
    } else {
        console.log("!@#$ Babelefied Error reading file: ", error)
    }
})
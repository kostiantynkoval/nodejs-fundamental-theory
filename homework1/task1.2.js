const fs = require("fs")
const csvToJson = require("csvtojson")

const csvFilePath = `${__dirname}/csv/homework1.csv`

fs.readFile(csvFilePath, (error, file) => {
    if (!error) {
        csvToJson({
            ignoreColumns: /Amount/,
            headers: ["book", "author", "price"]
        })
            .fromString(file.toString())
            .then(json => JSON.stringify(json).slice(1,-1).replace(/},{/g,"}\n{" ))
            .then((stringTable) => {
                fs.writeFile(`${__dirname}/result_task1_2.txt`, stringTable, error => {
                    if (error) {
                        console.log("!@#$ Error writing file: ", error)
                    } else {
                        console.log("#################### Converting Completed ######################")
                    }
                });
            })
            .catch(error => console.log("!@#$ Error converting to JSON: ", error))
    } else {
        console.log("!@#$ Error reading file: ", error)
    }
})

// Using Stream
const readStream=fs.createReadStream(csvFilePath);
const writeStream=fs.createWriteStream(`${__dirname}/result_stream_task1_2.txt`);
readStream.pipe(csvToJson({
    ignoreColumns: /Amount/,
    headers: ["book", "author", "price"]
})).pipe(writeStream);
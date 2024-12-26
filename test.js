const nodeCacheService = require("./services/node-cache.service");

const text =
    "NOMETER:32028946823/ID PELANGGAN:521031296570/NAMA:PR PERWITA REGENCY/TARIFDAYA:B1/3500VA/PLNREF:2412200935213505/RP BAYAR:500000/MATERAI:0/TOKEN:3689-4848-2718-1021-9956/PPN:0/PPJ:37038/ANGSURAN:0//RPTOKEN:462962/JUMLAHKWH:420.9";

function findStringBetweenText(str, startDelimiter, endDelimiter) {
    let regex;

    if (endDelimiter) {
        // Create a regex to capture between delimiters
        regex = new RegExp(`${startDelimiter}(.*?)${endDelimiter}`);
    } else {
        // Match everything after startDelimiter if no endDelimiter
        regex = new RegExp(`${startDelimiter}(.*)`);
    }

    // Use the regex to find the match
    const match = str.match(regex);

    // If a match is found, return the captured group
    if (match && match[1]) {
        return match[1].trim(); // Trim to remove any extra spaces
    } else {
        return null; // Return null if no match is found
    }
}

console.log(findStringBetweenText(text, "PLNREF:", "/RP BAYAR:"));
console.log(findStringBetweenText(text, "MATERAI:", "/PPN"));
console.log(findStringBetweenText(text, "/PPJ:", "/ANGSURAN:"));
console.log(findStringBetweenText(text, "/JUMLAHKWH:", ""));
console.log(findStringBetweenText(text, "TARIFDAYA:", "/PLNREF:"));
console.log(findStringBetweenText(text, "PPN:", "/PPJ:"));
console.log(findStringBetweenText(text, "ANGSURAN:", "//RPTOKEN:"));
console.log(findStringBetweenText(text, "RPTOKEN:", "/JUMLAHKWH:"));
// console.log(findStringBetweenText(text2, "/TOKEN:", ""));

const data = JSON.stringify({
    PLNREF: "2RBS21VS14142492352489891E1CC1C9",
    MATERAI: "0",
    PPN: "0",
    PPJ: "3847",
    ANGSURAN: "0",
    JUMLAHKWH: "66.6",
    TOKEN: "5678-4151-9742-9411-1594",
    SN: "TEST"
})

const data2 = {
    ...JSON.parse(data),
    SN: "asdasda",
}


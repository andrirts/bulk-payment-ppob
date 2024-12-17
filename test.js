const text =
  "Trx PLNFR100.538714055871 BERHASIL,Harga: 102.000 SN: NOMETER:86235085940/ID PELANGGAN:538714055871/NAMA:H SUPARMANTO/TARIFDAYA:R1/2200VA/PLNREF:2RBS21VS14142492352489891E1CC1C9/RP BAYAR:100120/MATERAI:0/PPN:0/PPJ:3847/ANGSURAN:0/RPTOKEN:96153/JUMLAHKWH:66.6/TOKEN:5678-4151-9742-9411-1594 Sisa Saldo: 3.752.045 - 102.000 = 3.650.045 @12/11/2024 3:03:55 PM";

const text2 = "/TOKEN:5678-4151-9742-9411-1594";

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
console.log(Number(findStringBetweenText(text, "/JUMLAHKWH:", "/TOKEN:")));
console.log(findStringBetweenText(text2, "/TOKEN:", ""));

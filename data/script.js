let fs = require("fs");

var obj = JSON.parse(fs.readFileSync("data/result.json", "utf8"));

var students = obj.students;

students.sort((a, b) => {
  if (a["TOTAL"] > b["TOTAL"]) return -1;
  else if (a["TOTAL"] < b["TOTAL"]) return 1;
  return 0;
});

let rank = 1;

students.forEach(e => {
  e["rank"] = rank;
  rank++;
});

fs.writeFile("data/high.json", JSON.stringify(students), "utf8", err => {
  if (err) throw err;
  console.log("success");
});

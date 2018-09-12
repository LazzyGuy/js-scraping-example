const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

let getUrl = (rollno, course, sem) => {
  return {
    uri: `http://14.139.239.134/EndResultHillDdn/Result.aspx/?rollno=${rollno}&course=${course}&semester=${sem}`,
    transform: function(body) {
      return cheerio.load(body);
    }
  };
};

async function multipleData(init_roll, end_roll, course, sem) {
  for (let i = init_roll; i < end_roll + 1; i++) {
    await singleData(i, course, sem);
  }
  let json = JSON.stringify(mainDataObj);
  fs.writeFile("data/result.json", json, "utf8", err => {
    if (err) throw err;
    console.log("COMPLETED");
  });
}

async function singleData(rollno, course, sem) {
  await rp(getUrl(rollno, course, sem))
    .then($ => {
      let name = $("#Lbl_sname").text();
      let rollno = $("#Lbl_roll").text();
      let sem1 = $("#lblsgpa1").text();
      let sem2 = $("#lblsgpa2").text();
      let sem3 = $("#lblsgpa3").text();
      let sem4 = $("#lblsgpa4").text();
      let sem5 = $("#lblsgpa5").text();
      let sem6 = $("#lbl_sgpa").text();
      let overAll = $("#lblcgpa").text();

      let resultObj = {
        NAME: name,
        ROLLNO: rollno,
        SEM1: sem1,
        SEM2: sem2,
        SEM3: sem3,
        SEM4: sem4,
        SEM5: sem5,
        SEM6: sem6,
        TOTAL: overAll
      };
      mainDataObj.students.push(resultObj);
      //   let resultString = `
      // -----------------------------------------
      // NAME : ${name}
      // ROLLNO: ${rollno}
      // SEM1: ${sem1}
      // SEM2: ${sem2}
      // SEM3: ${sem3}
      // SEM4: ${sem4}
      // SEM5: ${sem5}
      // SEM6: ${sem6}
      // TOTAL CGPA: ${overAll}
      // ------------------------------------------\n
      // `;
    })
    .catch(err => {
      console.log(err);
    });
}

let mainDataObj = {
  students: []
};
multipleData(1021401, 1021539, "BCA", 6);

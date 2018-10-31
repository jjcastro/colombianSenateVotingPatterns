// votaciones_01Jan2006_a_31Dec2016
Papa.SCRIPT_PATH = "../../../js/papaparse.min.js";

var fmtDate = d3.timeParse("%Y-%m-%d");

var fileName = "../votaciones_01Jan2006_a_31Dec2016.csv"
// var fileName = "../votaciones_abriged.csv";


const pCutoffs = {
  "2006-2010": [fmtDate("2006-07-20"), fmtDate("2010-07-20")],
  "2010-2014": [fmtDate("2010-07-20"), fmtDate("2014-07-20")],
  "2014-2018": [fmtDate("2014-07-20"), fmtDate("2018-07-20")]
};

const parties = {};

const meetsFilters = (vote) => {
  return (
    (
      vote["tipo_votacion"] == "Proposiciones" ||
      vote["tipo_votacion"] == "Acto Legislativo" ||
      vote["tipo_votacion"] == "Ley Estatutaria" ||
      vote["tipo_votacion"] == "Proyecto de Ley"
    )
    && vote["iniciativa"] == "Gubernamental"
  );
}

var step = (row) => {
  var vote = row.data[0];
  if (!meetsFilters(vote)) return;

  var name = vote.partido;
  // var name = vote.congresista;

  if (name) {
    if (parties[name] == null) {
      parties[name] = {
        "2006-2010": {no: 0, si: 0, sr: 0, total: 0},
        "2010-2014": {no: 0, si: 0, sr: 0, total: 0},
        "2014-2018": {no: 0, si: 0, sr: 0, total: 0},
      };
    }

    var fecha = fmtDate(vote.fecha);
    Object.keys(pCutoffs).forEach((period) => {
      if (fecha >= pCutoffs[period][0] && fecha < pCutoffs[period][1]) {
        if (vote.voto == "No") {
          parties[name][period].no++;
          parties[name][period].total++;
        } else if (vote.voto == "Si") {
          parties[name][period].si++;
          parties[name][period].total++;
        } else if (vote.voto == "Sin registro") {
          parties[name][period].sr++;
          parties[name][period].total++;
        }
      }
    });
  }
};

var exportToJsonFile = (jsonData) => {
  let dataStr = JSON.stringify(jsonData);
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  let exportFileDefaultName = 'bar_chart_data.json';
  
  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

Papa.parse(fileName, {
  download: true,
  header: true,
  step: step,
  complete: () => {
    exportToJsonFile(parties);
  }
});



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

const periodMaps = {
  "2006-2010": {},
  "2010-2014": {},
  "2014-2018": {},
};

const result = {
  "Cámara de Representantes": JSON.parse(JSON.stringify(periodMaps)),
  "Senado": JSON.parse(JSON.stringify(periodMaps)),
}

const getCorrespondingPeriod = (fecha) => {
  var selectedPeriod = null;
  Object.keys(pCutoffs).forEach((period) => {
    if (fecha >= pCutoffs[period][0] && fecha < pCutoffs[period][1]) {
      selectedPeriod = period;
    }
  });
  return selectedPeriod;
}

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

var exportToJsonFile = (jsonData) => {
  let dataStr = JSON.stringify(jsonData);
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  let exportFileDefaultName = 'ball_chart_data.json';
  
  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

d3.json("which_house_which_period.json", function(error, housePeriodMap) {

  var step = (row) => {
    var vote = row.data[0];
    if (!meetsFilters(vote)) return;

    // var name = vote.partido;
    var name = vote.congresista;
    if (name == null || name == '') return;

    var fecha = fmtDate(vote.fecha);
    var periodString = getCorrespondingPeriod(fecha);
    if (periodString == null) {
      // console.log(fecha);
      return;
    }

    var house = housePeriodMap[periodString][name];
    if (house == "----") {
      // console.log(vote);
      return;
    }

    // console.log(house);
    if (result[house][periodString][name] == null) {
      result[house][periodString][name] = {no: 0, si: 0, total: 0};
      result[house][periodString][name].nombre = vote.congresista;
      result[house][periodString][name].partido = vote.partido;
    } 

    if (vote.voto == "No") {
      result[house][periodString][name].no++;
      result[house][periodString][name].total++;
    } else if (vote.voto == "Si") {
      result[house][periodString][name].si++;
      result[house][periodString][name].total++;
    }    
  };

  var cleanup = (result) => {
    for (const house of Object.keys(result)) {
      var periodMap = result[house];
      var pplArray = [];
      for (const period of Object.keys(periodMap)) {
        var pplMap = periodMap[period];
        for (const name of Object.keys(pplMap)) {
          var selected = pplMap[name];
          selected.period = period;
          if (selected.si != 0 || selected.no != 0) {
            pplArray.push(selected);
          }
        }
      }
      result[house] = pplArray;
    }
    return result;
  }

  Papa.parse(fileName, {
    download: true,
    header: true,
    step: step,
    complete: () => {
      exportToJsonFile(cleanup(result));
      // console.log(cleanup(result));

    }
  });

});


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

const result = {
  "2006-2010": {},
  "2010-2014": {},
  "2014-2018": {},
};

const getCorrespondingPeriod = (fecha) => {
  var selectedPeriod = null;
  Object.keys(pCutoffs).forEach((period) => {
    if (fecha >= pCutoffs[period][0] && fecha < pCutoffs[period][1]) {
      selectedPeriod = period;
    }
  });
  return selectedPeriod;
}

var step = (row) => {
  var vote = row.data[0];
  // if (!meetsFilters(vote)) return;

  // var name = vote.partido;
  var name = vote.congresista;
  if (name == null || name == '') return;

  var house = vote.partido;

  var fecha = fmtDate(vote.fecha);
  var periodString = getCorrespondingPeriod(fecha);
  if (periodString == null) {
    console.log(fecha);
    return;
  }

  if (result[periodString][name] == null ||
      result[periodString][name] == '----') {
    result[periodString][name] = house;
  }  
};

var exportToJsonFile = (jsonData) => {
  let dataStr = JSON.stringify(jsonData);
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  let exportFileDefaultName = 'which_house_which_period.json';
  
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
    exportToJsonFile(result);
    // console.log(result);

  }
});



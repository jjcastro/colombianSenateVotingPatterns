// votaciones_01Jan2006_a_31Dec2016
Papa.SCRIPT_PATH = "../../../js/papaparse.min.js";

var parse  = d3.timeParse("%Y-%m-%d");
var format = d3.timeFormat("%Y-%m-%d");

var fileName = "../votaciones_01Jan2006_a_31Dec2016.csv"
// var fileName = "../votaciones_abriged.csv";

const years = {
  start: parse("2006-01-01"), 
  end: parse("2019-01-01")
};

const getFirstDayString = (stringDate) => {
  var date = parse(stringDate);
  var firstDay = new Date(date.getFullYear(), 0, 1);
  return format(firstDay);
}

// create monthly bucket limits
// [{ start: fmtDate("2006-01-01"), fmtDate("2006-02-01")}]
const boxes = {};
for (var y = 2006; y <= 2018; y++) {
  // for (var m = 0; m < 12; m++) {
  var firstDay = new Date(y, 0, 1);
  var lastDay = new Date(y + 1, 0);

  if (firstDay >= years.start && lastDay <= years.end) {
    boxes[format(firstDay)] = {si: 0, no: 0};
  }
  // }
}

console.log(boxes)

// create yearly bucket limits

// top-level map, to be exported:
const result = {};

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
  var registroVoto = row.data[0];
  const firstDay = getFirstDayString(registroVoto.fecha); // string
  
  // var name = registroVoto.partido;
  var name = registroVoto.congresista;

  if (name) {
    if (result[name] == null) {
      // clones base boxes
      result[name] = JSON.parse(JSON.stringify(boxes));
    }
    
    if (result[name][firstDay]) {

      if (meetsFilters(registroVoto)) {
        if (registroVoto.voto == "No") {
          result[name][firstDay].no++;
        } else if (registroVoto.voto == "Si") {
          result[name][firstDay].si++;
        }
      }
      
    } else {
      console.log("ERROR: no existe bucket: " + firstDay);
    }
  }
};

var cleanup = (result) => {
  for (const name of Object.keys(result)) {
    var buckets = result[name];
    for (const bucket of Object.keys(buckets)) {
      if (buckets[bucket].si == 0 && buckets[bucket].no == 0) {
        delete result[name][bucket];
      }
    }
  }
  return result;
}

var exportToJsonFile = (jsonData) => {
  let dataStr = JSON.stringify(jsonData);
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  let exportFileDefaultName = 'line_chart_data.json';
  
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
    exportToJsonFile(cleanup(result));
    // console.log(cleanup(result));
  }
});



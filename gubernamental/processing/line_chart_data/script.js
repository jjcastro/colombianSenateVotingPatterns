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

const mappings = {
  'Partido Verde': 'Alianza Verde',
  'Convergencia Ciudadana': 'Opción Ciudadana',
  'PIN - Partido de Integración Nacional': 'Opción Ciudadana'
}

// create bucket limits
const boxes = {};
for (var y = 2006; y <= 2019; y++) {

  // Los buckets representarán el siguiente mapeo:
  // y-03-16 | y    -07-20  =>  y-03-16 | y-06-20
  // y-07-20 | (y+1)-03-16  =>  y-07-20 | y-12-16

  var firstDay1 = new Date(y, 3-1, 16);

  var lastDay1  = new Date(y, 7-1, 20);
  var firstDay2 = new Date(y, 7-1, 20);

  var lastDay2  = new Date(y+1, 3-1, 16);

  boxes[format(firstDay1)] = {si: 0, no: 0};
  boxes[format(firstDay2)] = {si: 0, no: 0};
}

const findBox = (stringDate) => {
  const dates = Object.keys(boxes);
  for (var i = 0; i < dates.length - 1; i++) {
    if (+parse(dates[i]) <= parse(stringDate) &&
        parse(stringDate) < +parse(dates[i+1])) {
      return dates[i];
    }
  }

  return null;
}

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

const meetsDates = (name, year) => {
  return (
    year >= 2009 && 
    !(name == 'Centro Democrático' && year < 2014)
  )
}

var step = (row) => {
  var registroVoto = row.data[0];
  const firstDay = findBox(registroVoto.fecha); // string
  
  var name = mappings[registroVoto.partido] ? mappings[registroVoto.partido] : registroVoto.partido;
  // var name = registroVoto.congresista;

  if (name) {
    if (result[name] == null) {
      // clones base boxes
      result[name] = JSON.parse(JSON.stringify(boxes));
    }
    
    if (firstDay != null && result[name][firstDay]) {

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
  // calc percentages
  for (const name of Object.keys(result)) {
    var buckets = result[name];
    var total = 0;
    for (const bucket of Object.keys(buckets)) {
      total += buckets[bucket].si + buckets[bucket].no;
      if (buckets[bucket].si == 0 && buckets[bucket].no == 0) {
        delete result[name][bucket];
      }
    }
    // Deviation cutoff
    var average = total / Object.keys(buckets).length;
    var cutoff = average * 0.3;
    for (const bucket of Object.keys(buckets)) {
      if (buckets[bucket].si + buckets[bucket].no < cutoff) {
        delete result[name][bucket];
      }
    }
    // End Deviation cutoff
  }

  // change start dates for end dates
  var endDatesResult = {};

  var names = Object.keys(result);
  for (const name of names) {
    var buckets = result[name];
    var newBuckets = {};
    var bucketNames = Object.keys(buckets);
    for (const bucket of bucketNames) { 
      var elems = bucket.split('-'); //bucket.substring(4, bucket.length+1)
      var year = elems.shift();

      // Filter out by date
      if (meetsDates(name, +year)) {
        var newDate = year;
        if (elems.join('-') == '03-16') {
          newDate += '-06-20';  
        }
        else if (elems.join('-') == '07-20') {
          newDate += '-12-16';
        } else {
          console.log("ERROR for bucket: " + bucket)
        }
        newBuckets[newDate] = buckets[bucket];
      }
    }
    endDatesResult[name] = newBuckets;
  }

  return endDatesResult;
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
    console.log(cleanup(result));
  }
});



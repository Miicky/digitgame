var SPREAD_SHEET = SpreadsheetApp.getActiveSpreadsheet();
var LOGGER_SHEET = SPREAD_SHEET.getSheetByName("logger");
var ERROR_SHEET = SPREAD_SHEET.getSheetByName("errors");
var USERS_SHEET = SPREAD_SHEET.getSheetByName("users");

function Logs (logs) {
  logs.unshift (new Date());
  this.logs = logs;
  this.write_logs = function () {
    LOGGER_SHEET.appendRow(this.logs);
  }
  this.write_errors = function() {
    ERROR_SHEET.appendRow(this.logs);
  }
}

function write_log (text){
  LOGGER_SHEET.appendRow(text);
}

function write_logs (array){
  array.unshift (new Date());
  LOGGER_SHEET.appendRow(array);
}

function sorf_by_win (a,b) {
  if (a.wins < b.wins)
    return 1;
  if (a.wins > b.wins)
    return -1;
  return 0;
}

function sorf_by_best (a,b) {
  if (a.best_win_shots > b.best_win_shots || a.best_win_shots == 0)
    return 1;
  if (a.best_win_shots < b.best_win_shots)
    return -1;
  return 0;
}

function getObject(data, column_names){
  var object = {};
  for (var i in data){
    object[column_names[i]] = data[i];
  };
  return object;
}

function getObjects(sheet) {
  var objects = []
  var data = getData(sheet);
  var column_names = getTitles(sheet);
  for (var i in data){
    objects.push(getObject(data[i], column_names));
  };
  return objects;
}

function getWinners() {
  var objects = getObjects(USERS_SHEET);
  return objects.sort(sorf_by_win);
}

function getBests() {
  var objects = getObjects(USERS_SHEET);
  return objects.filter(haveWins).sort(sorf_by_best);
}

function getData(sheet){
  var lastRow = sheet.getLastRow()-1;
  var lastCol = sheet.getLastColumn();
  var result;
  if (lastRow == 0){
    result = []
  }else{
    result = sheet.getRange(2,1, lastRow, lastCol).getValues();
  }
  return result;
}

function getNewId(sheet){
  var last_index_row = sheet.getLastRow();
  var last_id = sheet.getRange(last_index_row, 1).getValue();
  var id;
  if (last_id == "id") {
    id = 1;
  } else {
    id = parseInt(last_id) + 1;
  }
  return id;
};

function getIds(sheet){
  var lastRow = sheet.getLastRow();
  var response = [];
  if (lastRow != 1) {
     response = sheet.getRange(2, 1, sheet.getLastRow()-1, 1).getValues();
  }
  return response;
}

function create(sheet, object){
  var column_name = getTitles(USERS_SHEET);
  var obj = [];
  for (var i in column_name){
    obj[i] = object[column_name[i]];
  };
  sheet.appendRow(obj);
  return object;
}

function setValues(sheet, battery, row){
  var names = getTitles(sheet);
  for (var i=0; i<names.length; i++){
    for (var key in battery){
      if (key == names[i] && key != "id"){
        var range = sheet.getRange(row,i+1, 1,1)
        range.setValue(battery[key])
        if (key == "number") {
          range.setNumberFormat("@");
        }
      }
    }
  }
}

function toObject(data, column_names){
  var object = {};
  for (var i in data){
    object[column_names[i]] = data[i];
  };
  return object;
}

function getTitles(sheet){
  return sheet.getRange(1,1, 1, sheet.getLastColumn()).getValues()[0];
}

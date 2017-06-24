function Game() {
  this.generateUniqDigit = function (numbers) {
    var flug = false;
    var digit = 0;
    do {
      digit = Math.floor(Math.random() * 10);
      for (var i in numbers) {
        if (numbers[i] == digit) {
          flug = true
        }
      }
    } while (flug == true);
    return digit;
  };
  this.validNumber = function (number) {
    var numbers = this.numberGetArray(number);
    var answer = new Checker(number, numbers).fullcheck();
    return answer;
  };
  this.numberGetArray = function (number) {
    var string = number.toString();
    // Spread sheet don't save 0 at first digit. Fix it in future
    if (string.length == 3) {
      string = "0" + string;
    }
    var numbers = [];
    var answer = true;
    for (var i = 0; i < string.length; i++) {
      numbers.push(string[i]);
    }
    return numbers;
  };
  this.generateNumber = function () {
    var number = [];
    for (var i = 0; i < 4; i++) {
      number[i] = this.generateUniqDigit(number);
    }
    return number.join("");
  }
  this.getResult = function (bot_number, user_number) {
    var good = 0;
    var position = 0;
    for (var i = 0; i<4; i++) {
      for (var j = 0; j< 4; j++) {
        if (bot_number[i] == user_number[j]) {
          good++;
           if (i == j) {
             position++;
          }
        }
      }
    }
    return [good,position];
  }
  this.getAnswer = function (check_number, user) {
    return this.getResult(this.numberGetArray(user.number), this.numberGetArray(check_number));
  }
};

function Checker (number, numbers) {
  this.number = number;
  this.numbers = numbers;
  this.fullcheck = function () {
    var checkInt = this.checkInteger();
    var checkLen = this.checkLength();
    var checkRep = this.checkRepeats();
    var status = checkInt.status && checkLen.status && checkRep.status;
    var messages = "";
    if (!checkInt.status) {
      messages = checkInt.message;
    } else {
      messages = [checkLen.message, checkRep.message].filter(function (val) {return val;})
                                                     .join(", ");
    }
    return { status: status, messages: messages}
  };
  this.checkInteger = function () {
    var number = this.number;
    var answer = false;
    var message = "Це не число";
    if (parseFloat(this.number) === this.number >>> 0) {
      answer = true;
      message = "";
    }
    return { status: answer, message: message };
  };
  this.checkLength = function () {
    var number = this.number;
    var answer = false;
    var message = "Погана довжина числа - має бути чотири цифри (1234)";
    if (number.length == 4) {
      answer = true;
      message = "";
    }
    return { status: answer, message: message };
  }
  this.checkRepeats = function () {
    var numbers = this.numbers;
    var answer = true;
    var message = "";
    numbers.sort();
    for (var j = 0; j < numbers.length; j++) {
      if (numbers[j] == numbers[j+1]) {
        answer = false;
        message = "Має повтори! Цифри не повинні повторятися";
      }
    };
    return { status: answer, message: message };
  }
}

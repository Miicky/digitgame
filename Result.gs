function Result(logs) {
  this.logs = logs;
  if (typeof logs == "undefined") {
    this.logs = [];
  }
  this.startGame = function () {
    var text = "Гра почалась!";
    var logs = this.logs;
    logs.unshift(text);
    return { text_message: text, logs: logs };
  }
  this.startNewGame = function () {
    var text = "Гра почалась!";
    var logs = this.logs;
    logs.unshift(text);
    return { text_message: text, logs: logs };
  }
  this.badRequest = function () {
    var text = this.logs[0];
    return { text_message: text, logs: ["Bad text", text] };
  }
  this.showAbout = function () {
    var text = "v0.9.1 Створено Igor Micky Pavliv. @Miiicky"
    return { text_message: text, logs: ["About Bot", text] };
  }
  this.shotResult = function (old_current_shot) {
    var digits = this.logs;
    var text = digits[0] + ":" + digits[1];
    if (digits[0] == 4 && digits[1] == 4) {
      text = "Ти відгадав число за "+ old_current_shot +" ходи (ів)!%0AПоздоровляю!"+
             "%0AЯ загадав нове число! Спробуй відгадати!";
    }
    digits.unshift("Shot", text);
    return { text_message: text, logs: digits };
  }
  this.showTop = function () {
    var users = this.logs;
    var text_message = "Лідери:%0A";
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      var string = i+1 + ". " + user.first_name + ": " +user.wins + "%0A";
      text_message += string;
    }
    return { text_message: text_message, logs: [text_message] };
  }
  this.showBest = function () {
    var users = this.logs;
    var text_message = "Найкращі результати:%0A";
    for (var i = 0; i < users.length; i++) {
      var user = users[i];
      var string = i+1 + ". " + user.first_name + ": " +user.best_win_shots + "%0A";
      text_message += string;
    }
    return { text_message: text_message, logs: [text_message] };
  }
  this.showMe = function () {
    var user = this.logs[0];
    var text_message = "Привіт " + user.first_name + "! Ти почав грати " +
                        formatDate(user.created_at) + "%0Aзіграв " +
                        user.game_count + " та виграв " + user.wins +
                        " разів!%0AТвій найкращий результат " + user.best_win_shots +
                        " спроб";
    return { text_message: text_message, logs: [user] };
  }
  this.showHelp = function () {
    var text_message = "/start - почати гру як новачок%0A /start - " +
                       "почати нову гру%0A/help - показати допомогу" +
                       "%0A /rules - показати правила гри%0A '1234' - " +
                       "спроба відгадати число%0A /me - твоя статистика%0A" +
                       " /top - Лідери%0A /best - Найкращі результати%0A /about - про творця";
    return { text_message: text_message, logs: [] };
  }
  this.showRules = function () {
    var text_message = "Я загадав число з чотирьох цифр що не повторюються!%0AСпробуйте відгадати " +
                       "його! напишіть мені число і я відповім скільки цифр ви вгадали і скільки з" +
                       " них стоїть на правильному місці! %0A%0AОсь вам приклад. Я загадав 3597." +
                       " Ви написали 3456. Ви відгадали дві цифри (три і п'ять!). Трійка стоїть " +
                       "перша як і в мене, а п'ятірку я поставив на друге місце а ви на третє :(" +
                       "Тому відповідь 2:1.%0A%0AКількість спроб - безкінечна! Бажаю вам отримати " +
                       "відповідь 4:4!";
    return { text_message: text_message, logs: [] };
  }
}

function formatDate(date) {
  var day = date.getDate();
  var monthIndex =  parseInt(date.getMonth()) + 1;
  var year = date.getFullYear();

  return day + "." + monthIndex + "." + year;
}

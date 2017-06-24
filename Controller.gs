var BOTTOKEN = "YOUR_BOT_TOKEN";

function doGet() {
  return ContentService.createTextOutput(JSON.stringify("Скоро буде"));
}

function doPost(e) {
  try {
    var update = JSON.parse(e.postData.contents);
    new Logs([update]).write_logs();
    if (update.hasOwnProperty("message") && !update.message.hasOwnProperty("sticker")) {
      var message = update.message;
      var result = new Action(message).getAction();
      sentAnswer(message.chat.id, result, update);
    } else {
      new Logs(["Havent message", update]).write_logs();
    }
  }
  catch (err) {
    new Logs(["Chach Error",
              err.message,
              err.name,
              err.toString(),
              err.fileName,
              err.lineNumber,
              err.stack])
      .write_errors();
  }
}

function Action(message) {
  this.message = message;
  this.game = new Game();
  this.getAction = function () {
    var action;
    var text = this.message.text;
    var valid;
    switch (text) {
      case "/start":
        action = [this.startGame(), this.showRules()];
        break;
      case "/new":
        action = this.startNewGame();
        break;
      case "/help":
        action = this.showHelp();
        break;
      case "/rules":
        action = this.showRules();
        break;
      case "/me":
        action = this.showMe();
        break;
      case "/top":
        action = this.showTop();
        break;
      case "/best":
        action = this.showBest();
        break;
      case "/about":
        action = this.showAbout();
        break;
      default:
        valid = this.game.validNumber(this.message.text);
        if (valid.status) {
          action = this.getAnswer();
        } else {
          action = this.errorAnswer(valid.messages);
        }
    }
    return action;
  };
  this.startGame = function() {
    var user = new User(this.message.from); //just class, user.attributes - init user.
    user.attributes.number = this.game.generateNumber();
    user.attributes.game_count = user.attributes.game_count + 1;
    user.saveUser();
    return new Result([user.attributes]).startGame();
  };
  this.startNewGame = function() {
    var user = new User(this.message.from); //just class, user.attributes - init user.
    user.attributes.number = this.game.generateNumber();
    user.attributes.game_count = user.attributes.game_count + 1;
    user.saveUser();
    return new Result([user.attributes]).startNewGame();
  };
  this.showTop = function() {
    var users = getWinners();
    return new Result(users).showTop();
  };
  this.showBest = function() {
    var users = getBests();
    return new Result(users).showBest();
  };
  this.showHelp = function() {
    return new Result().showHelp();
  };
  this.showMe = function() {
    var user = new User(this.message.from).attributes;
    return new Result([user]).showMe();
  };
  this.showRules = function() {
    return new Result().showRules();
  };
  this.showAbout = function() {
    return new Result().showAbout();
  };
  this.getAnswer = function() {
    var user = new User(this.message.from);
    var attr = user.attributes;
    var answer = this.game.getAnswer(this.message.text, user.attributes);
    attr.current_shot ++;
    var old_current_shot = attr.current_shot;
    if (answer[0] == 4 && answer[1] == 4){
      if (attr.best_win_shots > attr.current_shot || attr.best_win_shots === 0) {
        attr.best_win_shots = attr.current_shot;
      }
      attr.number = this.game.generateNumber();
      attr.wins ++;
      attr.game_count ++;
      attr.current_shot = 0;
    }
    user.saveUser();
    return new Result(answer).shotResult(old_current_shot);
  };
  this.errorAnswer = function(messages) {
    return new Result([messages]).badRequest();
  };
}

function sentAnswer(id, result, update){
  var telegram = new TelegramAPI(BOTTOKEN);
  if (result.constructor.name == "Array") {
    for (var i in result){
      sentOneAnswer(id, telegram, result[i], update);
    }
  } else {
    sentOneAnswer(id, telegram, result, update);
  }
}

function haveWins(user) {
  return user.wins > 0;
}

function sentOneAnswer(id, telegram, result, update) {
  result.logs.push(update);
  new Logs(result.logs).write_logs();
  telegram.sentMessage(id, result.text_message);
}

function sendNotify(message) {
  MailApp.sendEmail("YOURMAIL", "New User in DigitGame!",  message);
}

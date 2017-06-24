function User (user_params) {
  this.findUserBy = function (options) {
    try {
      if (USERS_SHEET.getLastRow() == 1) {
        throw new Error("Не можу знайти користувача");
      }
      var titles = getTitles(USERS_SHEET);
      var key = Object.keys(options)[0];
      var rowTitle;
      var rowUser;
      var user;
      for (var i in titles) {
        if (titles[i] == key) {
          rowTitle = parseInt(i);
        }
      };
      var ids = USERS_SHEET.getRange(2, rowTitle + 1, USERS_SHEET.getLastRow()-1, 1).getValues();
      for (var j in ids) {
        if (ids[j] == options[key]){
          rowUser = parseInt(j) + 2;
          var data = USERS_SHEET.getRange(rowUser, 1,1, USERS_SHEET.getLastColumn())
                                .getValues()[0];
          var column_name = USERS_SHEET.getRange(1,1, 1, USERS_SHEET.getLastColumn())
                                       .getValues()[0];
          user = toObject(data, column_name);
        }
      }
      if (typeof(user) == "undefined") {
        throw new Error("Не можу знайти користувача");
      } else {
        user.row_id = rowUser;
        return user;
      }
    }
    catch(err) {
      return err;
    }
  }

  this.initUser = function (user_params) {
    var user = this.findUserBy({ telegram_id: user_params.id });
    if (user.constructor.name == "Error") {
      user = this.createUser(user_params);
      var message = "First Name: " + user.first_name + " Last Name: " +
                    user.last_name + " User Name: " + user.username;
      sendNotify(message);
    }
    return user;
  }
  this.createUser = function (user_params) {
    var id = getNewId(USERS_SHEET);
    var game = new Game();
    user_params.telegram_id = user_params.id;
    user_params.id = id;
    user_params.current_shot = 0;
    user_params.best_win_shots = 0;
    user_params.game_count = 0;
    user_params.wins = 0;
    user_params.created_at = new Date();
    user_params.first_name = user_params.first_name || "";
    user_params.last_name = user_params.last_name || "";
    user_params.username = user_params.username || "";
    user_params.number = game.generateNumber();
    var user = create(USERS_SHEET, user_params);
    user.row_id = USERS_SHEET.getLastRow();
    return user;
  };
  this.attributes = this.initUser(user_params);
  this.saveUser = function () {
    setValues(USERS_SHEET, this.attributes, this.attributes.row_id);
  }
}

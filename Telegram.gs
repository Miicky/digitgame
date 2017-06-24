function TelegramAPI(token) {
  this.token = token;
  this.url = "https://api.telegram.org/bot" + token;
  this.setWebhook = function (app_url) {
    return UrlFetchApp.fetch(this.url + "/setWebhook?url=" + app_url);
  };
  this.getUpdates = function () {
    return UrlFetchApp.fetch(this.url + "/getUpdates");
  };
  this.aboutBot = function () {
    return UrlFetchApp.fetch(this.url + "/getMe");
  };
  this.sentMessage = function (chat_id, message) {
    return  UrlFetchApp.fetch(this.url + "/sendMessage?chat_id=" + chat_id + "&text=" + message);
  };
}

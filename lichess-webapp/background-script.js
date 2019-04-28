// Author: pdulvp
console.log("okok");

var port = browser.runtime.connectNative("lichess_bot");
console.log(port);

port.onMessage.addListener((response) => {
  console.log("Received message");
  console.log(response);
});

browser.runtime.onMessage.addListener(notify);

function notify(message) {
	console.log("Sending message");
	console.log(message);
	port.postMessage(message);
	console.log("Sent message");
}

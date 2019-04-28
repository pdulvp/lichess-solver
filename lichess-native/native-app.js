// Author: pdulvp
// Get process.stdin as the standard input object.
var standard_input = process.stdin;
var standard_output = process.stdout;

var engine = require("./engine");

// Set input character encoding.
standard_input.setEncoding('utf-8');

// Prompt user to input data in console.
//console.log("Please input text in command line.");

let msgBacklog = "";
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
    AppendInputString(chunk);
});
function AppendInputString(chunk) {
    msgBacklog += chunk;
    while (true) {
        if (msgBacklog.length < 4)
            return;
        let msgLength = msgBacklog.charCodeAt(0) + (msgBacklog.charCodeAt(1) << 8) +
            (msgBacklog.charCodeAt(2) << 16) + (msgBacklog.charCodeAt(3) << 24);
        if (msgBacklog.length < msgLength + 4)
            return;
        try {
            let msgObject = JSON.parse(msgBacklog.substring(4, 4 + msgLength));
            engine.nextmove(msgObject.fen+" w - - 0 34").then(function (moves) {
				msgObject.move = moves[0]; 
				engine.move(msgObject.move, msgObject).then(function (e) {
					msgObject.value = e;
					msgObject.readed = "true";
					Send( msgObject );
				}).catch(function (e) {
					msgObject.readed = "false";
					Send( msgObject );
				});
			});
        } catch (e) {
			Send( e );
		}
        msgBacklog = msgBacklog.substring(4 + msgLength);
    }
}

function Send(message) {
    let msgStr = JSON.stringify(message);
    let lengthStr = String.fromCharCode(
        msgStr.length & 0x000000ff,
        (msgStr.length >> 8) & 0x000000ff,
        (msgStr.length >> 16) & 0x000000ff,
        (msgStr.length >> 24) & 0x000000ff
    );
    process.stdout.write(lengthStr+msgStr);
}

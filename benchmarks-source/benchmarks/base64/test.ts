import * as base64 from "https://denopkg.com/chiefbiiko/base64/mod.ts";

const STR_SIZE = 131072;
const TRIES = 8192;

const b = new TextEncoder().encode("a".repeat(STR_SIZE));

function main() {
    var s = 0;
    var start = new Date().getTime();

    var str2 = base64.fromUint8Array(b);
        console.log("encode %s... to %s...: ",
		    str2.substring(0, 4));

    for (var i = 0; i < TRIES; i++) {
        str2 = base64.fromUint8Array(b);
        s += str2.length;
    }
    console.log("%d, %d", s, ((new Date().getTime() - start)));

    var str3 = base64.toUint8Array(str2);
        console.log("decode %s... to %s...: ",
		    str2.substring(0, 4));

    start = new Date().getTime();
    s = 0;
    for (var i = 0; i < TRIES; i++) {
        str3 = base64.toUint8Array(str2);
        s += str3.length;
    }
    console.log("%d, %d", s, ((new Date().getTime()) - start));
}

main();

// function notify(msg) {
//     return new Promise(resolve => {
//         const client = require('net').connect(9001, 'localhost', () => {
//             client.end(msg, 'utf8', () => {
//                 client.destroy();
//                 resolve();
//             });
//         }).on('error', resolve);
//     });
// }

// (async function() {
//     await notify(`Node.js\t${require('process').pid}`);
//     main();
//     await notify('stop');
// })();

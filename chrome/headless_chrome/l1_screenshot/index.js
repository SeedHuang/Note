const CDP = require('chrome-remote-interface');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');

function launchChrome(headless = true) {
        return chromeLauncher.launch({
                // port: 9222, // Uncomment to force a specific port of your choice.
                chromeFlags: [
            '--window-size=412,732',
            '--disable-gpu',
            headless ? '--headless' : ''
        ]
        });
}

(async function() {
        const chrome = await launchChrome(true);
        // console.log(">>>>>>>>>>>>>>>>>>This is chrome:", chrome);
        const protocol = await CDP({
                port: chrome.port
        });
        // console.log(">>>>>>>>>>>>>>>>>>This is DevTool Protocol:", protocol);
        const {
                Page,
                Runtime
        } = protocol;
        // console.log(">>>>>>>>>>>>>>>>>>This is Page:", Page);
        Page.navigate({
                url: 'https://mbrowser.baidu.com/web/rsstopic2/gate#/top/image/9988605960723668991'
        });
        await Promise.all([Page.enable(), Runtime.enable()]);
        console.log("before fired");
        Page.loadEventFired(async function() {
                console.log("fired");
                const {
                        data
                } = await Page.captureScreenshot({
                        'format': 'png'
                });
                const buffer = new Buffer(data, 'base64');
                console.log(">>>>>>>>>>>>>>>>>>This is data:", data);
                fs.writeFile('screenshot.png', buffer, 'base64', e => console.error(e));
                await protocol.close();
        })
})();

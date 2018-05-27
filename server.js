require('dotenv').load({ silent: true })

const TwitchBot = require('twitch-bot');
const request = require('request');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const Memcached = require('memcached');
Memcached.config.poolSize = 25;
const memcached = new Memcached(process.env.MEMCACHED_INSTACE + ':11211',{retries:1,retry:100,remove:true});
const Bot = new TwitchBot({
  username: 'wizard-of-legend-twitch-bot',
  oauth: process.env.AUTH,
  channels: ['']
});

function checkValue(valueToSearch){
    memcached.get("relicList", function (err, data) {
        if(data !== undefined){
            console.log("Taking data from memcached");
            console.log(data);
            searcher(data,valueToSearch);
        } else {
            let relicsPromise = getRelicsData();
            relicsPromise.then(function(relicsData){
                memcached.set("relicList", relicsData, 86400, function (err) {
                    console.log("setup relic list for 1 day");
                });
                searcher(relicsData,valueToSearch);
            });
        }
    });
}

function searcher(data,value){
    const result = data.find( relic => relic.searchName === value );
    if(result !== undefined){
      console.log(result.realName + " - " + result.description);
      Bot.say(result.realName + " - " + result.description);
    }
}

function getRelicsData(){
     return new Promise(function(resolve, reject) {
        let arr = [];
        request('https://wizardoflegend.gamepedia.com/Relics', (error, response, html) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            cheerioTableparser($);
            const data = $(".cargo-relic-table tbody").parsetable(true, true, true);
            for(relic in data[1]){
                let relicName = data[1][relic];
                relicName = relicName.replace(/['\s]/g,'').toLowerCase();
                const obj = {
                    "realName": data[1][relic],
                    "searchName": relicName,
                    "description": data[2][relic]
                };
                arr.push(obj);
            }
            console.log("Relic list scraping complete, sending back array");
            resolve(arr);
          } else {
            reject(error);
          }
        });
    });
}

Bot.on('join', channel => {
  console.log(`Joined channel: ${channel}`);
});

Bot.on('error', err => {
  console.log(err);
});

Bot.on('message', chatter => {
  if(chatter.message.indexOf('!relic') > -1) {
    checkValue(chatter.message.replace(/^[!relic]+/g,'').replace(/['\s]/g,'').toLowerCase());
  }
});
const fs = require('fs')
var request = require('request');

function req() {
    return new Promise(function (resolve, reject) {
        request({
       url: 'http://localhost:3000/',
       method: "GET",
     }, async function (error, response) {
       if (error) {
         reject(error);
       } else {
         resolve(JSON.parse(response.body));
       }
     })
    })
}

async function edit() {
  const link = await req()
      console.log()
    fs.writeFileSync(process.cwd()+'/config.json',    `
    {
        "server": {
          "http_port": ":8083",
          "ice_servers": ["stun:stun.l.google.com:19302"],
          "ice_username": "",
          "ice_credential": ""
        },
        "streams": {
          "${link.id}": {
            "on_demand": false,
            "disable_audio": true,
            "url": "rtsp://admin:Bionic12345@192.168.0.64:554/streaming/Channels/102"
          }    
        }
      }
    
    
    `,(erro)=>{
        if(erro){
            console.log(erro)
        }else{
            console.log("ok")
        }
        })

    
}
edit('opaaaaaaaaaaa')
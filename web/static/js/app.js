let stream = new MediaStream();
let suuid = $('#suuid').val();;
console.log('app.js')
let config = {
  iceServers: [{
    urls: ["stun:stun.l.google.com:19302"]
  }]
};
const pc = new RTCPeerConnection(config);
pc.onnegotiationneeded = handleNegotiationNeededEvent;

function main() {
  pc.ontrack = function (event) {
    console.log('ontrack')
    console.log(event)
    stream.addTrack(event.track);
    videoElem.srcObject = stream;
    log(event.streams.length + ' track is delivered')
  }

  pc.oniceconnectionstatechange = e => log(pc.iceConnectionState)
  $(document).ready(function () {
    $('#' + suuid).addClass('active');
    getCodecInfo();
  });
  let log = msg => {
    document.getElementById('div').innerHTML += msg + '<br>'
  }
}
async function handleNegotiationNeededEvent() {
  console.log('onnegotiationneeded')
  let offer = await pc.createOffer();
  console.log('offer', offer)
  await pc.setLocalDescription(offer);
  getRemoteSdp();
}
function getCodecInfo() {
  console.log('getCodecInfo')
  $.get("http://127.0.0.1:8083/stream/codec/"+suuid, function (data) {
    try {
      data = JSON.parse(data);     
    } catch (e) {
      console.log(e);
    } finally {
      $.each(data, function (index, value) {
        pc.addTransceiver(value.Type, {
          'direction': 'sendrecv'
        })
      })
    }
  });
}
function getRemoteSdp() {
  console.log('sdp')
  $.post("http://127.0.0.1:8083/stream/receiver/"+suuid, {
    suuid: suuid,
    data: btoa(pc.localDescription.sdp)
  }, function (data) {
    console.log('DATA', data)
    try {
      pc.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: atob(data)
      }))
    } catch (e) {
      console.log(e);
    }
  });
}
main()
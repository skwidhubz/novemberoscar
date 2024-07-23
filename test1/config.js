console.log("User Agent: " + navigator.userAgent);  
console.log("OS: " + navigator.platform);   
console.log("Language: " + navigator.language);  
console.log("Browser: " + navigator.vendor);     

navigator.getBattery().then(function(battery) {
    console.log("Battery level: " + (battery.level * 100) + "%");
    console.log("Battery charging: " + battery.charging);
    console.log("Battery charging time: " + battery.chargingTime + " seconds");
    console.log("Battery discharging time: " + battery.dischargingTime + " seconds");
});

navigator.geolocation.getCurrentPosition(function(position) {
    console.log("Latitude: " + position.coords.latitude);
    console.log("Longitude: " + position.coords.longitude);
});

if (navigator.deviceMemory) {
    console.log("Device RAM: " + navigator.deviceMemory + " GB");
} else {
    console.log("RAM info denied");
}

console.log(navigator.hardwareConcurrency);

navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    console.log(devices);
    devices.forEach(device => {
      if (device.kind === 'audioinput') {
        console.log(`Audio Input Device: ${device.label} (ID: ${device.deviceId})`);
      } else if (device.kind === 'audiooutput') {
        console.log(`Audio Output Device: ${device.label} (ID: ${device.deviceId})`);
      }
    });
  })
  .catch(error => {
    console.error('Error accessing media devices:', error);
  });

  navigator.mediaDevices
  .selectAudioOutput()
  .then((device) => {
    console.log("Audio devices??:" + device);
    console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
  })
  .catch((err) => {
    console.error(`${err.name}: ${err.message}`);
  });

  const constraints = {
    audio: true,
    video: { width: 1280, height: 720 },
  };
  
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((mediaStream) => {
      const video = document.querySelector("video");
      video.srcObject = mediaStream;
      video.onloadedmetadata = () => {
        video.play();
      };
    })
    .catch((err) => {
      // always check for errors at the end.
      console.error(`${err.name}: ${err.message}`);
    });
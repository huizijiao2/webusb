const x = document.getElementById('js-input')
x.onclick = function() {
  window.navigator.usb
    .requestDevice(params)
    .then(device => {
      console.log(device) // "Arduino Micro"
      console.log(device) // "Arduino LLC"
    })
    .catch(error => {
      console.log(error)
    })
}

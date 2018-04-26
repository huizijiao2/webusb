const x = document.getElementById('js-input')
x.onclick = function() {
  window.navigator.usb
    .requestDevice({ filters: [{ vendorId: 0483 }] })
    .then(device => {
      console.log(device) // "Arduino Micro"
      console.log(device) // "Arduino LLC"
    })
    .catch(error => {
      console.log(error)
    })
}

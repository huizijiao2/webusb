const x = document.getElementById('js-button')

function getWebusb(filters) {
  navigator.usb.getDevices().then(function(devices) {
    if (devices.length) {
      devices.map(device => {
        console.log(device.productName)
        console.log(device.manufacturerName)
      })
    }
  })
}
x.onclick = function() {
  const vid = parseInt(document.getElementById('js-vid').value, 16)
  const pid = parseInt(document.getElementById('js-pid').value, 16)

  navigator.usb
    .requestDevice({ filters: [{ vendorId: vid, productId: pid }] })
    .then(device => {
      console.log(device)
    })
    .catch(error => {
      console.log(error)
    })
}

const x = document.getElementById('js-button')

function getWebusb(filters) {
  navigator.usb.getDevices().then(function(devices) {
    if (devices.length) {
      devices.map(device => {
        console.log(device.productName)
        console.log(device.manufacturerName)
      })
    }
    return navigator.usb.requestDevice({ filters: filters })
  })
}
x.onclick = function() {
  const vid = document.getElementById('js-vid').value
  const pid = document.getElementById('js-pid').value

  getWebusb([{ vendorId: vid, productId: pid }])
    .then(device => {
      console.log(device)
    })
    .catch(error => {
      console.log(error)
    })
}

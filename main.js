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
  let device = null

  navigator.usb
    .requestDevice({ filters: [{ vendorId: vid, productId: pid }] })
    .then(selectedDevice => {
      device = selectedDevice
      return device.open()
    })
    .then(() => device.selectConfiguration(1)) // Select configuration #1 for the device.
    .then(() => device.claimInterface(0)) // Request exclusive control over interface #2.
    // .then(() =>
    //   device.controlTransferOut({
    //     requestType: 'standard',
    //     recipient: 'device',
    //     request: 0x06,
    //     value: 0302,
    //     index: 0409
    //   })
    // ) // Ready to receive data
    .then(() => {
      console.log('transfer in', device)
      device.transferOut(1, 
      '7E AA CC 80 02 00 00 00 00 00 0D 0A')
    }) // Waiting for 64 bytes of data from endpoint #5.
    .then(result => {
      let decoder = new TextDecoder()
      console.log('Received: ' + decoder.decode(result.data))
    })
    .catch(error => {
      console.log(error)
    })
  navigator.usb.getDevices().then(function(devices) {
    if (devices.length) {
      devices.map(device => {
        console.log(device.productName)
        console.log(device.manufacturerName)
      })
    }
  })
}

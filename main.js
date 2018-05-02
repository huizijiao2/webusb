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
  const vid = parseInt('0483', 16)
  const pid = parseInt('5710', 16)
  let device = null

  navigator.usb
    .requestDevice({ filters: [{ vendorId: vid, productId: pid }] })
    .then(selectedDevice => {
      device = selectedDevice
      return device.open()
    })
    .then(() => device.selectConfiguration(1)) // Select configuration #1 for the device.
    .then(() => device.claimInterface(0)) // Request exclusive control over interface #2.
    .then(() =>
      device.controlTransferOut({
        requestType: 'class',
        recipient: 'interface',
        request: 0x22,
        value: 0x00,
        index: 0x03
      })
    ) // Ready to receive data
    .then(() => {
      console.log('transfer in', device)
      const arr = new Uint8Array([0x7E, 0xAA, 0xCC, 0x80, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0D, 0x0A])
      // const arr = Buffer.from('0x7EAACC800200000000000D0A')
      // console.log(arr)
      // new ArrayBuffer([0x7E, 0xAA, 0xCC, 0x80, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0D, 0x0A])
      device.transferOut(1, arr.buffer)
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

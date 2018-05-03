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


  const openPort = {
    requestType: 'standard',
    recipient: 'device',
    request: 0x06,
    value: 0x0100,
    index: 0x00
  }

  const startPort = {
    requestType: 'vendor',
    recipient: 'device',
    request: 0x08,
    value: 0x00,
    index: 0x03
  }



  navigator.usb
    .requestDevice({ filters: [{ vendorId: vid, productId: pid }] })
    .then(selectedDevice => {
      device = selectedDevice
      return device.open()
    })
    .then(() => device.selectConfiguration(1)) // Select configuration #1 for the device.
    .then(() => {
      console.log(device.claimInterface(0))
      return device.claimInterface(0)
    })
    .then(() => {
      return device.selectAlternateInterface(0, 0)
    }) // Request exclusive control over interface #2.
    .then(() => {
      console.log('configurations:', device.configurations)
      console.log('interfaces:', device.configuration.interfaces)

      let result = device.controlTransferIn(openPort, 18)
      console.log('open port:', result)

      // result = device.controlTransferOut(startPort)
      // console.log('start port:', result)

      return result
    }) // Ready to receive data
    .then(() => {
      let result = device.transferIn(1, 18)
      console.log('result in', result)
      return result
      // console.log('transfer in', device)
      // const arr = new Uint8Array([
      //   0x7e,
      //   0xaa,
      //   0xcc,
      //   0x80,
      //   0x02,
      //   0x00,
      //   0x00,
      //   0x00,
      //   0x00,
      //   0x00,
      //   0x0d,
      //   0x0a
      // ])
      // const arr = Buffer.from('0x7EAACC800200000000000D0A')
      // console.log(arr)
      // new ArrayBuffer([0x7E, 0xAA, 0xCC, 0x80, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0D, 0x0A])
      // device.transferOut(1, arr.buffer)
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

document.addEventListener('DOMContentLoaded', event => {
  const button = document.getElementById('js-button')

  button.addEventListener('click', async () => {
    let device
    const VENDOR_ID = 0x0483
    const PRODUCT_ID = 0x5710
    const config = new Uint8Array(10)

    // const setPortConfig = {
    //   requestType: 'vendor',
    //   recipient: 'device',
    //   request: 0x05,
    //   value: 0x00,
    //   index: 0x03
    // }

    const getPort1 = {
      requestType: 'standard',
      recipient: 'device',
      request: 0x06,
      value: 0x0100,
      index: 0x00
    }

    const getPort2 = {
      requestType: 'standard',
      recipient: 'device',
      request: 0x06,
      value: 0x0200,
      index: 0x00
    }

    const getPort3 = {
      requestType: 'standard',
      recipient: 'device',
      request: 0x06,
      value: 0x0200,
      index: 0x00
    }

    const setPort1 = {
      requestType: 'standard',
      recipient: 'device',
      request: 0x09,
      value: 0x0001,
      index: 0x00
    }

    const setPort2 = {
      requestType: 'class',
      recipient: 'interface',
      request: 0x0a,
      value: 0x00,
      index: 0x00
    }

    const startPort = {
      requestType: 'vendor',
      recipient: 'device',
      request: 0x08,
      value: 0x00,
      index: 0x03
    }

    const closePort = {
      requestType: 'vendor',
      recipient: 'device',
      request: 0x07,
      value: 0x00,
      index: 0x03
    }

    async function close() {
      let result = await device.controlTransferOut(closePort)
      console.log('close port:', result)
      await device.releaseInterface(0)
      await device.close()
    }

    try {
      device = await navigator.usb.requestDevice({
        filters: [
          {
            vendorId: VENDOR_ID,
            productId: PRODUCT_ID
          }
        ]
      })

      console.log('open')
      await device.open()
      console.log('opened:', device)

      console.log('configurations:', device.configurations)
      if (device.configuration === null) {
        console.log('selectConfiguration')
        await device.selectConfiguration(1)
      }

      console.log('interfaces:', device.configuration.interfaces)
      console.log('claimInterface')
      await device.claimInterface(0)

      console.log('selectAlternateInterface')
      let seResult = await device.selectAlternateInterface(0, 0)
      console.log('selectAlternateInterface result', seResult)

      // let result = await device.controlTransferIn(getPort1, 18)
      // console.log('getPort1 port:', result.data)

      // result = await device.controlTransferIn(getPort2, 9)
      // const bLength = result.data.getInt8(2)
      // console.log('getPort2 port:', result.data)

      // result = await device.controlTransferIn(getPort3, bLength)
      // console.log('getPort3 port:', result.data)

      result = await device.controlTransferOut(setPort1)
      console.log('setPort1 port:', result)

      // result = await device.controlTransferOut(setPort2)
      // console.log('setPort2 port:', result)

      // result = await device.controlTransferOut(startPort)
      // console.log('start port:', result)

      // config.set([
      //   0x00, 0x30, // baud rate (19200 : 0x0030)
      //   0x60, 0x00, // flags ¯\_(ツ)_/¯
      //   0x03,       // data bits (8 : 0x03)
      //   0x00,       // parity (none : 0)
      //   0x00,       // stop bits (none : 0)
      //   0x11,       // xon (false : 0)
      //   0x13,       // xoff (false : 0)
      //   0x00        // UART mode (RS-232 : 0)
      // ])
      // result = await device.controlTransferOut(setPortConfig, config)
      // console.log('set port config:', result)

      const data = new Uint8Array(12)
      data.set([
        0x7e,
        0xaa,
        0xcc,
        0x80,
        0x02,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x0d,
        0x0a
      ])
      result = await device.transferOut(0x01, data.buffer)
      console.log('mem:', result)

      // const timeoutID = window.setTimeout(async () => {
      //   console.warn('Device not connected')
      //   await close()
      // }, 5000)

      // console.log('Receiving...')
      // while (true) {
      //   let incoming = await device.transferIn(0x01, 1024)

      //   if (incoming.data.byteLength > 0) {
      //     clearTimeout(timeoutID)
      //     let decoder = new TextDecoder() // eslint-disable-line no-undef
      //     const data = decoder.decode(incoming.data)
      //     console.log(data)
      //     if (data.includes('END')) {
      //       break
      //     }
      //   }
      // }
      // await close()
    } catch (error) {
      console.log(error)
    }
  })
})

// function getWebusb(filters) {
//   navigator.usb.getDevices().then(function(devices) {
//     if (devices.length) {
//       devices.map(device => {
//         console.log(device.productName)
//         console.log(device.manufacturerName)
//       })
//     }
//   })
// }
// x.onclick = function() {
//   const vid = parseInt('0483', 16)
//   const pid = parseInt('5710', 16)
//   let device = null

//   const openPort = {
//     requestType: 'standard',
//     recipient: 'device',
//     request: 0x06,
//     value: 0x0100,
//     index: 0x00
//   }

//   const startPort = {
//     requestType: 'vendor',
//     recipient: 'device',
//     request: 0x08,
//     value: 0x00,
//     index: 0x03
//   }

//   navigator.usb
//     .requestDevice({ filters: [{ vendorId: vid, productId: pid }] })
//     .then(selectedDevice => {
//       device = selectedDevice
//       return device.open()
//     })
//     .then(() => device.selectConfiguration(1)) // Select configuration #1 for the device.
//     .then(() => {
//       console.log(device.claimInterface(0))
//       return device.claimInterface(0)
//     })
//     .then(() => {
//       return device.selectAlternateInterface(0, 0)
//     }) // Request exclusive control over interface #2.
//     .then(() => {
//       let result = device.controlTransferIn(openPort, 18)
//       console.log('open port:', result)
//       return result
//     }) // Ready to receive data
//     .then(() => {
//       console.log('device', device)
//       let readLoop = () => {
//         console.log('readLoop in')
//         device.transferIn(1, 18).then(
//           result => {
//             let textDecoder = new TextDecoder()
//             console.log('Received: ' + decoder.decode(result.data))
//             readLoop()
//           },
//           error => {
//             console.log('error in', error)
//           }
//         )
//       }
//       readLoop()
//       // let result = device.transferIn(0, 64)
//       // console.log('result in', result)
//       // return result
//       // console.log('transfer in', device)
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
//       // const arr = Buffer.from('0x7EAACC800200000000000D0A')
//       // console.log(arr)
//       // new ArrayBuffer([0x7E, 0xAA, 0xCC, 0x80, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0D, 0x0A])
//       // device.transferOut(1, arr.buffer)
//     }) // Waiting for 64 bytes of data from endpoint #5.
//     .catch(error => {
//       console.log(error)
//     })
//   navigator.usb.getDevices().then(function(devices) {
//     if (devices.length) {
//       devices.map(device => {
//         console.log(device.productName)
//         console.log(device.manufacturerName)
//       })
//     }
//   })
// }

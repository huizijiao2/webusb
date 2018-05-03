## A simple https server for usbweb to debug .
- 1. First of install dependecies
```
  npm install
```
- 2. launch server

```
 node index.js
```

- 4. add host to the /etc/hosts
append the line as follows to the file /etc/hosts
```
127.0.0.1       www.testwebusb.com
```


- 5. click ca.crt to import the certificate

- 6. open the web, view https://www.testwebusb.com:8080/index.html

enjoy your coding trip.
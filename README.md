# find-me
This is a real-time location-based discovery application.

**Overview**

This implementation is mainly using JavaScript with NodeJS as the server.
It also leverages on Google Maps API to enable location support.
It also uses socket.io for real-time communication between connected clients.

**Pre-requisites**

This would require Node JS and NPM in your local.

This would also require setting up a Google API key.
https://developers.google.com/maps/documentation/javascript/get-api-key

**Set-up**

Install dependencies:
```
npm install
```

To start the server, run this command:
```
node app/socket.js
```

Open at least 2 browsers with this URL:
```
http://localhost:8081/
```

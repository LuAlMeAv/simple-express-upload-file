![](/src/frontend/icons/icon.png)
# Upload Files

This is a simple file upload project that allows you to easily and quickly upload files from other devices on your local network.

## Install

This project is using ExpressJS on the back end, so you will need to run the command:

```
npm i
```
Once the dependencies are installed, you can execute:

```
npm start
```

## Usage
It is designed for a local network, so you need to change the `API_URL` variable with the IP of the device on your local network.

You can also use the port you want by changing the `EXPLICIT_PORT` variable.

Files:

`src/index.js`
```
const API_URL = 'http://your_local_ip_address'
const EXPLICIT_PORT = 3000
```
`src/frontend/main.js`
```
const API_UTL = 'http://your_local_ip_address:3000'
```

### Considerations
By default, the project runs on [http://localhost:3000](http://localhost:3000).

This project was created for a local network and the security level is low.

I used Nodemon for development, if you want to add features you can use the command 
```
npm run dev
```
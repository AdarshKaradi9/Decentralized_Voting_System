var os = require('os');
var dotenv = require('dotenv');
const { parsed } = dotenv.config();
var ifaces = os.networkInterfaces();
const ip = () => {
    console.log("Getting network ip address....")
    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
            if (ifname.includes("enp") && 'IPv4' === iface.family) {
                process.env.REACT_APP_IP = iface.address;
                process.env.REACT_APP_IP = parsed.REACT_APP_IP;
                console.log(process.env.REACT_APP_IP);
            }
        });
    });
}

ip();
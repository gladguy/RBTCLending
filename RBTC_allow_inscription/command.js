const { exec } = require("child_process");

const storeInscription = (address, token) => {
    return new Promise((resolve, reject) => {
        exec(`python3 allowInscription.py ${address} ${token}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return reject(error);
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return reject(stderr);
            }
            console.log(`stdout: ${stdout}`);
            resolve(stdout);
        });
    });
}

module.exports = { storeInscription };

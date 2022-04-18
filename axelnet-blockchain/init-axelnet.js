const platform = require('process');
const shell = require('shelljs');

// A driver script for initializing the axelnet-blockchain depending on the operating system

const main = async () => {

    // set permissions based on operating system
    if (process.platform === "win32") {
        shell.exec("call windows-start.bat");
    } else if (process.platform === "darwin") {
        shell.exec("chmod +x mac-start.sh && ./mac-start.sh");
    }
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
var mySocketHelper = {
    io: null,

    startSockets: (ioFromApp) => {
        this.io = ioFromApp;
    },

    sendMessage: (msg) => {
        this.io.emit('updated_vacations', msg);
    }

}

module.exports = mySocketHelper;
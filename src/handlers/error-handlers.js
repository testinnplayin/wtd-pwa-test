'use strict';

module.exports = {
    get404: function (res, str) {
        console.error(`---- ERROR: Cannot find ${str}`);
        return res.status(404).json({ message : `Cannot find ${str}` });
    },
    get500 : function (res, err, str) {
        console.error(`---- ERROR: Internal server error ${str} : ${err}`);
        return res.status(500).json({ message : `Internal server error ${str} : ${err}`});
    }
};
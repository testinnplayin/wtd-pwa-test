'use strict';

module.exports = {
    get204 : function (res) {
        console.info(`Request successful for deletion`);
        return res.status(204).end();
    },
    getSuccess : function (res, data, str, status) {
        console.info(`Request successful for ${str}`);
        return res.status(status).json({ [`${str}`] : data });
    }
};
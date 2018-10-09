'use strict';

module.exports = {
    getSuccess : function (res, data, str) {
        return res.status(200).json({ [`${str}`] : data });
    }
};
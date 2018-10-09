'use strict';

module.exports = {
    get200 : function (res, data, str) {
        return res.status(200).json({ [`${str}`] : data });
    }
};
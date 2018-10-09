'use strict';

function checkForField(arrOfFields, reqObj) {
    arrOfFields.forEach(field => {
        if (!reqObj.hasOwnProperty(field)) {
            return { isOk : false, field : field };
        }
    });
}

module.exports = {
    checkFor400 : function (req, res, arrOfFields, str) {
        let reqStatus = {
            isOk : true,
            field : null
        };

        if (!req.body) {
            return res.status(400).json({ message : `Badly formed ${str}, no request body`});
        } else if (req.body) {
            reqStatus = checkForField(arrOfFields, req.body);
            
            if (!reqStatus.isOk) {
                return res.status(400).json({ message : `Badly formed ${str}, required field ${reqStatus.field}`});
            }
        }
    },
    get404 : function (res, str) {
        console.error(`---- ERROR: Cannot find ${str}`);
        return res.status(404).json({ message : `Cannot find ${str}` });
    },
    get500 : function (res, err, str) {
        console.error(`---- ERROR: Internal server error ${str} : ${err}`);
        return res.status(500).json({ message : `Internal server error ${str} : ${err}`});
    }
};
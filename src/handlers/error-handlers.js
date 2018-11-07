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
        if (!req.body) {
            console.error(`---- ERROR: No body in ${str} request ----`);
            return res.status(400).json({ message : `Badly formed ${str}, no request body`});
        } else if (req.body) {
            let reqStatus = checkForField(arrOfFields, req.body);

            if (reqStatus && !reqStatus.isOk) {
                console.error(`---- ERROR: Badly-formed request for ${str}, lacks required field ${field} ----`);
                return res.status(400).json({ message : `Badly formed ${str}, required field ${reqStatus.field}`});
            }
        }
    },
    get400 : function (res, str) {
        console.error(`---- ERROR: Bad request in count for ${str} ----`);
        return res.status(400).json({ message : `There has been a problem with the count request for ${str}` });
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
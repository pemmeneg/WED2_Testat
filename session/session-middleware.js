const sessionUserSettings = (req, res, next) => {
    const userSettings = req.session.userSettings || {orderBy: 'default', orderDirection: -1, displayFinished : false, theme : 'dark'};
    const orderBy = req.query.orderBy;
    const toggleFinished = req.query.togglefinished;
    const theme = req.query.theme;

    if (orderBy) {
        if(orderBy === userSettings.orderBy) {
            userSettings.orderDirection *= -1;
        } else {
            userSettings.orderDirection = -1;
        }
        userSettings.orderBy = orderBy;
    }
    if(toggleFinished) {
        if(userSettings.displayFinished) {
            userSettings.displayFinished = false;
        } else {
            userSettings.displayFinished = true;
        }
    }

    if(theme) {
        userSettings.theme = theme;
    }

    req.userSettings = req.session.userSettings = userSettings;

    next();
};

export {sessionUserSettings};
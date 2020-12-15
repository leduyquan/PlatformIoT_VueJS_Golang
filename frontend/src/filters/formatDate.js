module.exports =(function (dateValue, dateFormat, isStamp) {
    if (!dateFormat) {
        dateFormat = 'DD/MM/YYYY hh:mmA';
    }
    if (!userTimezone) userTimezone = 'UTC';

    if (dateValue) {
        var _dateValue = {};
        if(isStamp){
            _dateValue = moment.unix(String(dateValue)).utc().tz(userTimezone);
        }else{
            _dateValue = moment.utc(String(dateValue)).tz(userTimezone);
        }
        var _dateFormatted = _dateValue.format(dateFormat);
        if(localeCode ==='th'){
            _dateFormatted = _dateFormatted.replace(_dateValue.year().toString(), parseInt(_dateValue.year())+543);
        }
        return _dateFormatted;
    }
});

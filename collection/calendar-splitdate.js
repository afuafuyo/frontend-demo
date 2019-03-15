function SplitDate() {}
SplitDate.from = function(str) {
    var ret = {};
    
    var dateRegExp = new RegExp([
        // (year)
        '(\\d+)?',
        // (month)
        '(?:\\-(\\d+))?',
        // (date)
        '(?:\\-(\\d+))?',
        // \s
        '\\s?',
        // (hours)
        '(\\d+)?',
        // (minutes)
        '(?::(\\d+))?',
        // (seconds)
        '(?::(\\d+))?'
    ].join(''));
    
    var dateRegExpKeys = [
        'source',
        'year',
        'month',
        'date',
        'hours',
        'minutes',
        'seconds'
    ];
    
    var matches = str.match(dateRegExp);
    
    if(null !== matches) {
        for(var i=0,len=dateRegExpKeys.length; i<len; i++) {
            ret[dateRegExpKeys[i]] = matches[i];
        }
    }
    
    return ret;
};
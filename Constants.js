INTERFACE_SPECIFIER = {
    "TABLE" : "#TABLE#",
    "ROW" : "#HORIZONTAL#",
    "COLUMN" : "#VERTICAL#",
    "HORIZONTAL" : "#HORIZONTAL#",
    "VERTICAL" : "#VERTICAL#",
    "COMPLEX" : "#COMPLEX#",
    "SET" : "#SET#",
    "STRING" : "#STRING#",
    "INTEGER" : "#INTEGER#",
    "REAL" : "#REAL#",
    "BOOLEAN" : "#BOOLEAN#",
    "DATETIME" : "#DATETIME#",
    "BLOB" : "#BLOB#",
    "ALT" : "#ALT#",
    "TERMINAL_VALUE" : "#TERMINAL_VALUE#",
    "UNDEFINED" : "",
    "REGULAR_EXPR" : /#[\w]*#/g
};

SPECIFIER = {
    "ONE" : "~one",
    "ONEMM" : "~onemm",
    "COPY" : "~copy",
    "COPYMM" : "~copymm",
    "SET" : "~list",
    "SETMM" : "~listmm",
    "PROXY" : "~proxy",
    "ALT" : "~ALT",
    "REGULAR_EXPR" : /~[\w]*\b/g
};

TERMINAL = {
    "SORT" : {
        "STR" : "[str]",
        "INT" : "[int]",
        "REAL" : "[real]",
        "BOOL" : "[bool]",
        "DATE" : "[date]",
        "BLOB" : "[blob]",
        "REGULAR_EXPR" : /\[(str|int|real|bool|date|blob)\]/g
    },
    "VALUE" : {
        "STR" : /\["[\w\W]*"\]/g,
        "INT" : /\[-?[\d]+\]/g,
        "REAL" : /\[-?[\d]+(\.[\d]+)?\]/g,
        "BOOL" : /\[(true|false)\]/g,
        "DATE" : /\[[\d]{2}\.[\d]{2}\.[\d]{4}-[\d]{2}:[\d]{2}:[\d]{2}.[\d]{3}\]/g,
        "BLOB" : /\['[\w\W]*'\]/g,
        "REGULAR_EXPR" : /[^\[]([\S\s]*)(?=\])/g
    },
    "REGULAR_EXPR" : /\[[\w\W]*\]/g
};

TO = {
    "STR" : function( value ) { return "[\"" + value + "\"]";},
    "INT" : function( value ) { return "[" + value + "]";},
    "REAL" : function( value ) { return "[" + value + "]";},
    "BOOL" : function( value ) { return "[" + value + "]";},
    "DATE" : function( value ) {
        var year = value.substring(0, 4),
            month = value.substring(5, 7),
            day = value.substring(8, 10),
            hour = value.substring(11, 13),
            min = value.substring(14, 16),
            sec = "00",
            milisec = "000";

        return "[" + day + "." + month + "." + year + "-" + hour + ":" + min + ":" + sec + "." + milisec + "]";
    },
    "BLOB" : function( value ) { return "[\'" + value + "\']";}
};

FROM = {
    "STR" : function( value ) { return value.substring( 2, value.length - 2 ); },
    "INT" : function( value ) { return value.substring( 1, value.length - 1 ); },
    "REAL" : function( value ) { return value.substring( 1, value.length - 1 ); },
    "BOOL" : function( value ) { return value.substring( 1, value.length - 1 ); },
    "DATE" : function( value ) {
        var year = value.substring(7, 11),
            month = value.substring(4, 6),
            day = value.substring(1, 3),
            hour = value.substring(12, 14),
            min = value.substring(15, 17);

        return year + "-" + month + "-" + day + "T" + hour + ":" + min;
    },
    "BLOB" : function( value ) { return value.substring( 2, value.length - 2 ); },
};
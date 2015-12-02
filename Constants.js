INTERFACE_SPECIFIER = {
    "COLLECTION": "#COLLECTION#",
    "STRING" : "#STRING#",
    "INTEGER" : "#INTEGER#",
    "REAL" : "#REAL#",
    "BOOLEAN" : "#BOOLEAN#",
    "DATETIME" : "#DATETIME#",
    "BLOB" : "#BLOB#",
    "ALT" : "#ALT#",
    "COMPLEX" : "#COMPLEX#",
    "TERMINAL_VALUE" : "#TERMINAL_VALUE#",
    "UNDEFINED" : "",
    "REGULAR_EXPR" : /#[\w]*#/g
};

COLLECTION_ORIENTATION = {
    "HORIZONTAL": "HORIZONTAL",
    "VERTICAL": "VERTICAL"
};

COLLECTION_TYPE = {
    "LIST" : "LIST",
    "SET" : "SET"
};

SPECIFIER = {
    "ONE" : "~one",
    "ONEMM" : "~onemm",
    "COPY" : "~copy",
    "COPYMM" : "~copymm",
    "SET" : "~set",
    "SETMM" : "~setmm",
    "LIST" : "~list",
    "LISTMM" : "~listmm",
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
    "BLOB" : function( value ) { return "[\'" + value + "\']";},
    "NAME" : function( value ) { return "[" + value + "]";}
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
    "NAME" : function( value ) { return value.substring( 1, value.length - 1 ); }
};

DEFAULT_VALUE = {
    "[str]" : "_",
    "[int]" : "0",
    "[real]" : "0",
    "[bool]" : "0",
    "[date]" : (function(){
        var value = (new Date()).toISOString(),
            year = value.substring(0, 4),
            month = value.substring(5, 7),
            day = value.substring(8, 10),
            hour = value.substring(11, 13),
            min = value.substring(14, 16),
            sec = "00",
            milisec = "000";

        return day + "." + month + "." + year + "-" + hour + ":" + min + ":" + sec + "." + milisec;
    })(),
    "[blob]" : "0"
};

TRANSLATE_SORT = {
    "[str]" : '(cорт: Строковое)',
    "[int]" : '(cорт: Целое)',
    "[real]" : '(cорт: Вещественное)',
    "[bool]" : '(cорт: Логическое)',
    "[date]" : '(cорт: Дата и время)',
    "[blob]" : '(cорт: Бинарные данные)'
};

ACTION = {
    SHOW: 'развернуть содержимое',
    GENERATE: 'открыть генератор понятия',
    NEW: 'создать новый экземпляр данного понятия',
    CREATE: 'сохранить после генерации',
    UPDATE: 'сохранить после редактирования',
    EDIT_TITLE: 'редактировать понятие',
    DELETE_TITLE: 'удалить отношение к понятию',
    DELETE: 'удалить отношение'
};
function Button( name, click ) {
    this.btn = document.createElement( 'button' );  
    this.btn.textContent = name;
    this.btn.onclick = click;
    
    return this.btn;
}

function Vertex( name, specifiers, interface_specifier, sort ) {
    this.name = name;
    this.specifiers = specifiers;
    this.interface_specifier = interface_specifier;
    this.sort = sort;
    this.children = Array();
    
    this.resetSpecifiers = function() {
        if ( this.specifiers ) {
            for ( var i = this.specifiers.length - 1; i >= 0 ; i-- ) {
                if ( this.specifiers[i] == SPECIFIER.SET || this.specifiers[i] == SPECIFIER.SETMM || this.specifiers[i] == SPECIFIER.ONEMM ) {
                    this.specifiers.splice( i, 1 );
                }
            }
        }

        this.interface_specifier = INTERFACE_SPECIFIER.UNDEFINED;
    }
    
    this.updateSpecifier = function() {
        if ( !in_array( SPECIFIER.SET, this.specifiers ) && !in_array( SPECIFIER.SETMM, this.specifiers ) 
            && !in_array( SPECIFIER.COPY, this.specifiers ) && !in_array( SPECIFIER.COPYMM, this.specifiers ) 
            && !in_array( SPECIFIER.ONE, this.specifiers ) && !in_array( SPECIFIER.ONEMM, this.specifiers ) ) {
            
            this.specifiers.push( ( this.sort ? SPECIFIER.ONE : SPECIFIER.COPY) );
        }    
        return this;
    }
    
    this.updateInterfaceSpecifier = function() {
        if ( this.interface_specifier == INTERFACE_SPECIFIER.UNDEFINED 
            && ( in_array( SPECIFIER.SET, this.specifiers ) || in_array( SPECIFIER.SETMM, this.specifiers ) || in_array( SPECIFIER.ONEMM, this.specifiers ) ) ) {
            this.interface_specifier = INTERFACE_SPECIFIER.SET;            
        } else if ( this.sort && this.interface_specifier == INTERFACE_SPECIFIER.UNDEFINED ) {
            switch ( this.sort ) {
                case TERMINAL.SORT.STR : this.interface_specifier = INTERFACE_SPECIFIER.STRING; break;
                case TERMINAL.SORT.INT : this.interface_specifier = INTERFACE_SPECIFIER.INTEGER; break;  
                case TERMINAL.SORT.REAL : this.interface_specifier = INTERFACE_SPECIFIER.REAL; break;
                case TERMINAL.SORT.BOOL : this.interface_specifier = INTERFACE_SPECIFIER.BOOLEAN; break;
                case TERMINAL.SORT.DATE : this.interface_specifier = INTERFACE_SPECIFIER.DATETIME; break;
                case TERMINAL.SORT.BLOB : this.interface_specifier = INTERFACE_SPECIFIER.BLOB; break;
                default : {
                    if ( this.sort.match( TERMINAL.VALUE.STR ) || this.sort.match( TERMINAL.VALUE.INT )
                    || this.sort.match( TERMINAL.VALUE.REAL ) || this.sort.match( TERMINAL.VALUE.BOOL )
                    || this.sort.match( TERMINAL.VALUE.DATE ) || this.sort.match( TERMINAL.VALUE.BLOB ) ) {
                        this.interface_specifier = INTERFACE_SPECIFIER.TERMINAL_VALUE; 
                    } else {
                        this.interface_specifier = INTERFACE_SPECIFIER.UNDEFINED; 
                    }
                     break;
                }                
            }            
        } else if ( in_array( SPECIFIER.ALT, this.specifiers ) && this.interface_specifier == INTERFACE_SPECIFIER.UNDEFINED )  {
            this.interface_specifier = INTERFACE_SPECIFIER.ALT;   
        } else if ( !this.sort && this.interface_specifier == INTERFACE_SPECIFIER.UNDEFINED )  {
            this.interface_specifier = INTERFACE_SPECIFIER.COMPLEX;   
        } else if ( this.interface_specifier == INTERFACE_SPECIFIER.UNDEFINED ){
            this.interface_specifier = INTERFACE_SPECIFIER.UNDEFINED;   
        }
        return this;
    }
    
    this.getEditInterface = function() {
        var edit_interface;
        
        switch ( this.interface_specifier ) {
            case INTERFACE_SPECIFIER.TABLE : edit_interface = ( new Table( this ) ).getEditInterface(); break;
            case INTERFACE_SPECIFIER.ALT : edit_interface = ( new Alt( this ) ).getEditInterface(); break; 
            case INTERFACE_SPECIFIER.SET : edit_interface = ( new Set( this ) ).getEditInterface(); break;
            case INTERFACE_SPECIFIER.COMPLEX : edit_interface = ( new Complex( this ) ).getEditInterface(); break;
            case INTERFACE_SPECIFIER.BOOLEAN : edit_interface = ( new Boolean( this ) ).getEditInterface(); break; 
            case INTERFACE_SPECIFIER.DATETIME : edit_interface = ( new Datetime( this ) ).getEditInterface(); break; 
            case INTERFACE_SPECIFIER.STRING : edit_interface = ( new String( this ) ).getEditInterface(); break; 
            case INTERFACE_SPECIFIER.INTEGER : edit_interface = ( new Integer( this ) ).getEditInterface(); break; 
            case INTERFACE_SPECIFIER.REAL : edit_interface = ( new Real( this ) ).getEditInterface(); break;   
            case INTERFACE_SPECIFIER.BLOB : edit_interface = ( new Blob( this ) ).getEditInterface(); break;
            case INTERFACE_SPECIFIER.TERMINAL_VALUE : edit_interface = ( new TerminalValue( this ) ).getEditInterface(); break;
            default : {
                edit_interface = document.createElement( 'div' );
                edit_interface.textContent = "Что-то пошло не так...";
                break;
            }
        }
        
        return edit_interface;
    };
    
    this.getInformation = function( block ) {
        var info;
        
        switch ( this.interface_specifier ) {
            case INTERFACE_SPECIFIER.TABLE : info = ( new Table( this ) ).getInformation( block ); break;
            case INTERFACE_SPECIFIER.ALT : info = ( new Alt( this ) ).getInformation( block ); break; 
            case INTERFACE_SPECIFIER.SET : info = ( new Set( this ) ).getInformation( block ); break;
            case INTERFACE_SPECIFIER.COMPLEX : info = ( new Complex( this ) ).getInformation( block ); break;
            case INTERFACE_SPECIFIER.BOOLEAN : info = ( new Boolean( this ) ).getInformation( block ); break; 
            case INTERFACE_SPECIFIER.DATETIME : info = ( new Datetime( this ) ).getInformation( block ); break; 
            case INTERFACE_SPECIFIER.STRING : info = ( new String( this ) ).getInformation( block ); break; 
            case INTERFACE_SPECIFIER.INTEGER : info = ( new Integer( this ) ).getInformation( block ); break; 
            case INTERFACE_SPECIFIER.REAL : info = ( new Real( this ) ).getInformation( block ); break;   
            case INTERFACE_SPECIFIER.BLOB : info = ( new Blob( this ) ).getInformation( block ); break;
            case INTERFACE_SPECIFIER.TERMINAL_VALUE : info = ( new TerminalValue( this ) ).getInformation( block ); break;
            default : info = []; break;
        }
        
        return info;
    };
    
    this.putInformation = function( info, block ) {        
        switch ( this.interface_specifier ) {
            case INTERFACE_SPECIFIER.TABLE : info = ( new Table( this ) ).putInformation( info, block ); break;
            case INTERFACE_SPECIFIER.ALT : info = ( new Alt( this ) ).putInformation( info, block ); break; 
            case INTERFACE_SPECIFIER.SET : info = ( new Set( this ) ).putInformation( info, block ); break;
            case INTERFACE_SPECIFIER.COMPLEX : info = ( new Complex( this ) ).putInformation( info, block ); break;
            case INTERFACE_SPECIFIER.BOOLEAN : info = ( new Boolean( this ) ).putInformation( info, block ); break; 
            case INTERFACE_SPECIFIER.DATETIME : info = ( new Datetime( this ) ).putInformation( info, block ); break; 
            case INTERFACE_SPECIFIER.STRING : info = ( new String( this ) ).putInformation( info, block ); break; 
            case INTERFACE_SPECIFIER.INTEGER : info = ( new Integer( this ) ).putInformation( info, block ); break; 
            case INTERFACE_SPECIFIER.REAL : info = ( new Real( this ) ).putInformation( info, block ); break;   
            case INTERFACE_SPECIFIER.BLOB : info = ( new Blob( this ) ).putInformation( info, block ); break;
            case INTERFACE_SPECIFIER.TERMINAL_VALUE : info = ( new TerminalValue( this ) ).putInformation( info, block ); break;
            default : info = []; break;
        }
    };
}

function IrToJson( text ) {

    function get_full_name( text, current_pos ) {
        var line, lines = Array();
        
        /* Костыль для ссылок */
        line = text.substring( current_pos ).match( /^[\s\S]*?;/ );
        if ( line ) {lines.push( line[0] );}
        
        line = text.substring( current_pos ).match( /^[\s\S]*?[\s\S](?={)/ );
        if ( line ) lines.push( line[0] );
        
        line = text.substring( current_pos ).match( /^[\s\S]*?]/ );
        if ( line ) lines.push( line[0] );
        
        line = text.substring( current_pos ).match( /^[\s]*(?=})/ );
        if ( line ) lines.push( line[0] );
        
        line = "";
        
        for ( var i = 0; i < lines.length; i++ ) {
            if ( !line.length ) {
                line = lines[i];
            } 
            if ( lines[i].length < line.length ){
                line = lines[i];
            }
        }
        
        return line;
    }
    
    var current_pos = 0,
          tree = new Vertex( "tree", [SPECIFIER.COPY,SPECIFIER.PROXY], INTERFACE_SPECIFIER.COMPLEX, null ),
          stack = [tree],
          current_vertex;
    
    while ( current_pos < text.length && stack.length > 0 ) {
        var full_name = get_full_name( text, current_pos );
        
        current_pos = current_pos + full_name.length + 1;
        
        current_vertex = stack.pop();
        
        if ( !full_name.trim().length ) continue;
        
        var _specifiers = full_name.match( SPECIFIER.REGULAR_EXPR ), 
              _interface_specifier = full_name.match( INTERFACE_SPECIFIER.REGULAR_EXPR ),
              _sort = full_name.match( TERMINAL.REGULAR_EXPR ),
              
              specifiers = ( ( _specifiers ) ? _specifiers : Array() ),
              interface_specifier = ( ( _interface_specifier ) ? _interface_specifier[0] : INTERFACE_SPECIFIER.UNDEFINED ),
              sort = ( ( _sort ) ? _sort[0] : null );
        
        name = full_name.replace( SPECIFIER.REGULAR_EXPR, "" )
            .replace( INTERFACE_SPECIFIER.REGULAR_EXPR, "" )
            .replace( TERMINAL.REGULAR_EXPR, "" )
            .trim(); 
            
        var toPushVertex = new Vertex( name, specifiers, interface_specifier, sort );
        toPushVertex.updateSpecifier().updateInterfaceSpecifier();  
        
        current_vertex.children.push( toPushVertex ); 
        stack.push( current_vertex );
        
        if ( text[current_pos-1] == "{" ) {
            stack.push( current_vertex.children[current_vertex.children.length-1] );         
        }  
    }
    
    return tree;
}

function JsonToIr( json ) {
    var text = putVertex( json, 0 );
    
    return text;
    
    function putVertex( vertex, level ) {
        var text = "";
        
        if ( vertex.length >= 0 ) {
            for ( var i = 0; i < vertex.length; i++ ) {
                text = text + putVertex( vertex[i], level );
            }
            return text;
        }
        
        for ( var i = 0; i < level*2; i++ ) {
            text = text + " ";
        }
        
        text = text + vertex.name;
        
        if ( !vertex.sort ) {
            text = text + " {\n";
            for ( var i = 0; i < vertex.children.length; i++ ) {
                text = text + putVertex( vertex.children[i], level + 1 );
            }
            for ( var i = 0; i < level*2; i++ ) {
                text = text + " ";
            }
            text = text + "}\n";
        } else {
            text = text + vertex.sort + "\n";;
        }
        
        return text;
    }
}

INTERFACE_SPECIFIER = {
    "TABLE" : "#TABLE#", 
    "ROW" : "#ROW#", 
    "COLUMN" : "#COLUMN#",
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
}

SPECIFIER = {
    "ONE" : "~one", 
    "ONEMM" : "~onemm", 
    "COPY" : "~copy",
    "COPYMM" : "~copymm",
    "SET" : "~set", 
    "SETMM" : "~setmm", 
    "PROXY" : "~proxy",
    "ALT" : "~ALT",
    "REGULAR_EXPR" : /~[\w]*\b/g
}

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
}

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
}

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
}

function in_array( value, array ) {
    for ( var i = 0; i < array.length; i++ ) {
        if ( array[i] == value ) return true;
    };
    return false;
}

function clone( obj ) {
    if ( obj == null || typeof( obj ) != 'object' )
        return obj;
    var temp = new obj.constructor(); 
    for ( var key in obj )
        temp[key] = clone( obj[key] );
    return temp;
}
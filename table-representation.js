/**
 * Table representation by los-romka
 */
(function( $ ) {
﻿;function Button( name, click ) {
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
    "SET" : "~list",
    "SETMM" : "~listmm",
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
    }

    return false;
}

function clone( obj ) {
    if ( obj == null || typeof( obj ) != 'object' )
        return obj;
    var temp = new obj.constructor(); 
    for ( var key in obj ) {
        if ( obj.hasOwnProperty( key ) ) {
            temp[key] = clone( obj[key] );
        }
    }

    return temp;
};function IrParser() {

    return {
        toJson: function IrToJson( text ) {
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

                var name = full_name.replace( SPECIFIER.REGULAR_EXPR, "" )
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
        },

        toIr: function ( json ) {
            return putVertex( json, 0 );
        }
    };

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

    function get_full_name( text, current_pos ) {
        var line, lines = [];

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
};function Table( root ) {

    if ( root.interface_specifier != INTERFACE_SPECIFIER.TABLE ) return;
    
    var root = clone( root );
    
    this.name = root.name;
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );    
    this.element_metainf;
    this.type;
    
    for ( var i = 0; i < root.children.length; i++ ) {
        if ( in_array( root.children[i].interface_specifier, [INTERFACE_SPECIFIER.ROW, INTERFACE_SPECIFIER.COLUMN] ) ) {
            this.element_metainf = root.children[i];
            this.type = root.children[i].interface_specifier;
            break;
        }
    }
    
    this.traversal = get_first_traversal( this.element_metainf );
    this.leafs = get_leafs( this.traversal );
    
    this.width = get_width( this.element_metainf );
    this.height = get_height( this.element_metainf );
    
    this.element_metainf.level = 0;
    this.element_metainf.width = this.width;
    this.element_metainf.height = this.height;
    
    this.min_elements;
    this.max_elements;
    
    if ( in_array( SPECIFIER.ONE, this.element_metainf.specifiers ) || in_array( SPECIFIER.COPY, this.element_metainf.specifiers ) ) {
        this.min_elements = 1;
        this.max_elements = 1;
    } else if ( in_array( SPECIFIER.ONEMM, this.element_metainf.specifiers ) || in_array( SPECIFIER.COPYMM, this.element_metainf.specifiers ) ) {
        this.min_elements = 0;
        this.max_elements = 1;
    } else if ( in_array( SPECIFIER.SET, this.element_metainf.specifiers ) ) {
        this.min_elements = 1;
        this.max_elements = 100000;
    } else if ( in_array( SPECIFIER.SETMM, this.element_metainf.specifiers ) ) {
        this.min_elements = 0;
        this.max_elements = 100000;
    }
        
    this.elements_count = 0;
    
    this.matrix = get_matrix( this.type, this.width, this.height, this.traversal );      
    
    this.table_block;    
    this.add_btn;
    this.delete_btn;
        
    this.getEditInterface = function(){
        this.table_block = get_table_block( this.element_metainf, this.title, this.matrix );
        
        this.add_btn = get_add_button( this );
        this.delete_btn = get_delete_button( this );        
        
        var control_block = document.createElement( 'div' );
        $(control_block).addClass("control_block");
        control_block.appendChild( this.add_btn );    
        control_block.appendChild( this.delete_btn );    
        this.table_block.appendChild( control_block );
            
        while ( this.elements_count < this.min_elements ) {
            this.add_btn.click();
        }
            
        update_buttons( this );
        
        return this.table_block;
    }
    
    this.getInformation = function( block ) { 
        var list = block.querySelector( 'table' ),
              set = new Vertex( this.name, [], "", null ),             
              size = get_size_from_blocks( this.type, this.height, list );
        
        for ( var i = 0; i < size ; i++ ) {
            var leafs_vals = Array();
            
            if ( this.type == INTERFACE_SPECIFIER.ROW ) {
                for ( var j = 0; j < list.children[i + this.height + 1].children.length; j++ ) {
                    leafs_vals.push( list.children[i + this.height + 1].children[j].querySelector( 'div' ) );
                }
            } else {
                for ( var j = this.width - 1; j >= 0 ; j-- ) {
                    leafs_vals.push( list.children[j].children[list.children[j].children.length - size + i].querySelector( 'div' ) );
                }
            }
            
            var info = merge_leafs_val_with_meta( leafs_vals, this.element_metainf );
            
            set.children.push( info );
        } 

        return set;
    }
    
    this.putInformation = function( info, block ) {
        var children = block.children, 
              title_shift = ( block.children[0].nodeName == "H1" ? 1 : 0),
              elementsOfSet = new Array(),
              k = 0,
              list = block.querySelector( 'table' ),
              size = get_size_from_blocks( this.type, this.height, list ),
              leafs_meta = get_leafs( get_first_traversal( clone( this.element_metainf ) ) )
              
              
        while ( info.children[k] && this.element_metainf.name == info.children[k].name ) {
            elementsOfSet.push( info.children[k] );
            k++;
        }
        
        while ( size < elementsOfSet.length ) {
            block.lastChild.children[0].click();
            size++;
        }
        
        for ( var i = 0; i < size ; i++ ) {
            var leafs_blocks = Array();
            
            if ( this.type == INTERFACE_SPECIFIER.ROW ) {
                for ( var j = 0; j < list.children[i + this.height + 1].children.length; j++ ) {
                    leafs_blocks.push( list.children[i + this.height + 1].children[j].querySelector( 'div' ) );
                }
            } else {
                for ( var j = this.width - 1; j >= 0 ; j-- ) {
                    leafs_blocks.push( list.children[j].children[list.children[j].children.length - size + i].querySelector( 'div' ) );
                }
            }
            
            put_info_leafs_vals( elementsOfSet[i], leafs_blocks, this.element_metainf );
        }  
    }
    
    function get_size_from_blocks( type, height, table ) {
        var size = 0;
        
        if ( type == INTERFACE_SPECIFIER.ROW ) {
            size = table.children.length - height - 1;
        } else {            
            for ( var j = 0; j < table.children[0].children.length; j++ ) {
                if ( table.children[0].children[j].nodeName != "TH" ) {
                    size++;
                }
            }
        }    
        
        return size;
    }
    
    function put_info_leafs_vals( info, leafs_blocks, element_metainf ) {
        var traversal_meta = Array(),
              queue_meta = Array(),
              traversal_info = Array(),
              queue_info = Array();
        
        queue_meta.push( clone(element_metainf) );
        queue_info.push( clone(info) );
        
        while ( queue_meta.length ) {
            
            var current_meta = queue_meta.pop(),
                  current_info = queue_info.pop();
                  
            traversal_meta.push( current_meta );            
            
            if ( isHeaderVertex( current_meta ) ) {       
                var k = 0;
                for ( var i = 0; i < current_meta.children.length; i++ ) {
                    queue_meta.push( current_meta.children[i] );
                    
                    if ( in_array( current_meta.children[i].interface_specifier, [INTERFACE_SPECIFIER.SET] ) ) {
                        var elementsOfSet = new Array();
                        while ( current_info.children[i + k] && current_meta.children[i].name == current_info.children[i + k].name ) {
                            elementsOfSet.push( current_info.children[i + k] );
                            k++;
                        }
                        k--;
                        queue_info.push( elementsOfSet );
                    } else {
                        queue_info.push( current_info.children[i+k] );
                    }               
                }
            } else {
                traversal_info.push( current_info );
            }
        }
        
        for ( var i = traversal_meta.length - 1; i >= 0; i-- ) {
            if ( isHeaderVertex( traversal_meta[i] ) ) {
                traversal_meta.splice( i, 1 );
            }  
        }
        
        if ( traversal_meta.length == 0 ) {
            element_metainf.resetSpecifiers();
            element_metainf.updateSpecifier();
            element_metainf.updateInterfaceSpecifier();
            
            traversal_meta.push( element_metainf );
            traversal_info.push( info ); 
        }
        
        for ( var i = 0; i < traversal_meta.length; i++ ) {
            traversal_meta[i].putInformation( traversal_info[i], leafs_blocks.pop() );
        }
    }
    
    function merge_leafs_val_with_meta( leafs_vals, element_metainf ) {
        var vertex = clone( element_metainf ),
              traversal = get_first_traversal( vertex );
        
        if ( traversal.length == 1 ) {
            var value = leafs_vals.shift(),
                  current = traversal.pop();
                  
            current.resetSpecifiers();
            current.updateSpecifier();
            current.updateInterfaceSpecifier();
            
            return current.getInformation( value );
        }
        
        while ( traversal.length ) {
            
            var parent = traversal.pop();
            if ( !isHeaderVertex( parent ) ) continue;
            
            for ( var i = 0; i < parent.children.length; i++ ) {
                var current = parent.children[i];
                if ( !isHeaderVertex( current ) ) {
                    var value = leafs_vals.shift(),
                          info = current.getInformation( value );   
                    
                    if ( info.length >= 0) {
                        parent.children[i] = info;
                    } else {
                        current.sort = info.sort;
                        current.children = info.children;
                    }
                }
            }
        }
        
        return vertex;
    }
    
    function get_table_block( element_metainf, title, matrix ) {
        var table_block = document.createElement( 'div' );
        $(table_block).addClass("table_block");
        
        if ( title ) {
            var ttl = document.createElement( 'h1' );
            ttl.textContent = title;
            table_block.appendChild( ttl );
        }
        
        if ( !element_metainf ) return table_block;
        
        table_block.appendChild( form_table( matrix ) ); 
        
        return table_block;
        
    }
    
    function get_add_button( table_class ) { 
        var btn = new Button( "+", function() {        
            table_class.elements_count++;
            
            if ( table_class.element_metainf.sort ) {
                var td = document.createElement( 'td' ); 
                
                if ( !in_array( SPECIFIER.PROXY, table_class.element_metainf.specifiers ) ) {
                    table_class.element_metainf.specifiers.push( SPECIFIER.PROXY );
                }   
                
                table_class.element_metainf.resetSpecifiers();
                table_class.element_metainf.updateSpecifier();
                table_class.element_metainf.updateInterfaceSpecifier();
                
                td.appendChild( table_class.element_metainf.getEditInterface() );  
                
                if ( table_class.type == INTERFACE_SPECIFIER.ROW ) {
                    var tr = document.createElement( 'tr' );                                          
                    tr.appendChild( td );                         
                    table_class.table_block.querySelector( 'table' ).appendChild( tr );
                } else {                    
                    table_class.table_block.querySelector( 'table>tr' ).appendChild( td );
                }
            } else {
                var tr = document.createElement( 'tr' ); 
                for ( var i =  table_class.leafs.length - 1; i >= 0; i-- ) {
                    var td = document.createElement( 'td' );
                    
                    if ( !in_array( SPECIFIER.PROXY, table_class.leafs[i].specifiers ) ) {
                        table_class.leafs[i].specifiers.push( SPECIFIER.PROXY );
                    }
                    
                    td.appendChild( table_class.leafs[i].getEditInterface() );  
                    
                    if ( table_class.type == INTERFACE_SPECIFIER.ROW ) {
                        tr.appendChild( td );
                    } else {
                        table_class.table_block.querySelector( 'table' ).children[i].appendChild( td );
                    }
                }
                if ( table_class.type == INTERFACE_SPECIFIER.ROW ) {
                    table_class.table_block.querySelector( 'table' ).appendChild( tr );
                }
            }
            
            update_buttons( table_class );
        });
        
        return btn;
    }

    function get_delete_button( table_class ) { 
        var btn = new Button( "-", function() { 
            table_class.elements_count--;
            
            if ( table_class.type == INTERFACE_SPECIFIER.ROW ) {
                table_class.table_block.querySelector( 'table' ).lastChild.remove();
            } else {
                for ( var i = 0; i < table_class.table_block.querySelector( 'table' ).children.length; i++ ) {
                    table_class.table_block.querySelector( 'table' ).children[i].lastChild.remove();
                }
            }
            
            update_buttons( table_class );
        });
        
        return btn;
    }
    
    function update_buttons( table_class ) {
        table_class.delete_btn.disabled = !( table_class.elements_count > table_class.min_elements );
        table_class.add_btn.disabled = !( table_class.elements_count < table_class.max_elements );
    }

    function form_table( matrix ) {
        var table = document.createElement( 'table' );
        
        for ( var i = 0; i < matrix.length; i++ ) {
            var tr = document.createElement( 'tr' ); 
            
            for ( var j = 0; j < matrix[i].length; j++ ) {
                var th = document.createElement( 'th' );
                th.colSpan = matrix[i][j].colSpan;  
                th.rowSpan = matrix[i][j].rowSpan;   
                th.textContent = matrix[i][j].textContent;
                tr.appendChild( th );
            }
            
            table.appendChild( tr );
        }
        
        return table;
    }

    function get_matrix( type, width, height, traversal ) {
        var traversal = clone( traversal );        
        
        return ( ( type == INTERFACE_SPECIFIER.COLUMN ) 
            ? get_vertical_matrix( width, height, traversal ) 
            : get_horizontal_matrix( width, height, traversal ) );            
    }
    
    function get_vertical_matrix( width, height, traversal ) {
        var matrix = Array(),
              current;        
              
        for ( var i = 0; i < width; i++ ) {
            matrix[i] = Array();
        }
        
        var row_height = 0,
              current_row = 0;
              
        if ( in_array( SPECIFIER.PROXY, traversal[0].specifiers ) ) {
            traversal.shift();
            row_height = 1;
        }
        
        while ( current = traversal.shift() ) { 
        
            var height_inc = ( isHeaderVertex( current ) ? 1 : ( height - current.level ) );
                
            if ( row_height >= height ) {
                row_height = current.level;
                current_row++;
            }
            
            matrix[current_row].push({
                rowSpan : current.width,
                colSpan : height_inc,
                textContent : ( ( in_array( SPECIFIER.PROXY, current.specifiers ) ) ? "" : current.name )            
            });
            
            row_height = row_height + height_inc;
        }            
        
        return matrix;
    }

    function get_horizontal_matrix( width, height, traversal ) {
        var matrix = Array(), 
              current;        
              
        for ( var i = 0; i <= height; i++ ) {
            matrix[i] = Array();
        }
        
        if ( in_array( SPECIFIER.PROXY, traversal[0].specifiers ) ) {
            traversal.shift();
        }
        
        while ( current = traversal.pop() ) {
            matrix[current.level].push({
                rowSpan : ( isHeaderVertex( current ) ? 1 : ( height - current.level ) ),
                colSpan : current.width,
                textContent : ( ( in_array( SPECIFIER.PROXY, current.specifiers ) ) ? "" : current.name )
            });
        }        
        
        return matrix;
    }

    function get_leafs( traversal ) {
        var leafs = clone( traversal );
        
        for ( var i = leafs.length - 1; i >= 0; i-- ) {
            if ( isHeaderVertex( leafs[i] ) ) {
                leafs.splice( i, 1 );
            }  
        }
        
        return leafs;
    }
    
    function get_first_traversal( element_metainf ) {
        var traversal = Array(),
              queue = Array();
              
        queue.push( element_metainf );
          
        while ( queue.length ) {
            
            var current = queue.pop();
            
            if ( !in_array( current, traversal ) ) {        
                traversal.push( current );
                if ( isHeaderVertex( current ) ) {       
                    for ( var i = 0; i < current.children.length; i++ ) {
                       queue.push( current.children[i] );
                    }
                }
            }
        }
        
        return traversal;
    }
    
    function get_height( vertex, level ) {        
        var height = 1;
        level = level || 1;   
        
        if ( isHeaderVertex( vertex ) ) {
            
            vertex.children.forEach( function( child ) {   
                child.height = get_height( child, level + 1 );
                child.level = level;
                height =  Math.max( height, child.height + 1 );
            });
        }
        
        return height;
    }
    
    function get_width( vertex ) {
        var width = 0;
        
        if ( ( isHeaderVertex( vertex ) ) 
            && vertex.children.length ) {    
            
            vertex.children.forEach( function( child ) {
                child.width = get_width( child );
                width = width + child.width;
            });
        } else {
            width = 1;
        }
                    
        return width;
    }
    
    function isHeaderVertex( vertex ) {
        return in_array( vertex.interface_specifier, [INTERFACE_SPECIFIER.UNDEFINED, INTERFACE_SPECIFIER.COMPLEX, INTERFACE_SPECIFIER.ROW, INTERFACE_SPECIFIER.COLUMN] );
    }
       
};function Set( root ) {
    
    if ( root.interface_specifier != INTERFACE_SPECIFIER.SET ) return;
    
    var root = clone( root );
    
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );
    this.element_metainf = root;
    
    this.min_elements;
    this.max_elements;
    
    if ( in_array( SPECIFIER.ONE, this.element_metainf.specifiers ) || in_array( SPECIFIER.COPY, this.element_metainf.specifiers ) ) {
        this.min_elements = 1;
        this.max_elements = 1;
    } else if ( in_array( SPECIFIER.ONEMM, this.element_metainf.specifiers ) || in_array( SPECIFIER.COPYMM, this.element_metainf.specifiers ) ) {
        this.min_elements = 0;
        this.max_elements = 1;
    } else if ( in_array( SPECIFIER.SET, this.element_metainf.specifiers ) ) {
        this.min_elements = 1;
        this.max_elements = 100000;
    } else if ( in_array( SPECIFIER.SETMM, this.element_metainf.specifiers ) ) {
        this.min_elements = 0;
        this.max_elements = 100000;
    }
    
    this.elements_count = 0;
    
    this.set_block;
    this.add_btn;
    this.delete_btn;
    
    this.getEditInterface = function() {
        this.set_block = get_set_block( this.element_metainf, this.title );
        
        this.add_btn = get_add_button( this );      
        this.delete_btn = get_delete_button( this ); 
        
        var control_block = document.createElement( 'div' );
        $(control_block).addClass("control_block");
        control_block.appendChild( this.add_btn );    
        control_block.appendChild( this.delete_btn );    
        this.set_block.appendChild( control_block );
        
        while ( this.elements_count < this.min_elements ) {
            this.add_btn.click();
        }
        
        update_buttons( this );
        
        return this.set_block;
    }
    
    this.getInformation = function( block ) { 
        var list = block.querySelector( 'ul' ),
              set = Array();
              
        this.element_metainf.resetSpecifiers();
        this.element_metainf.updateSpecifier();
        this.element_metainf.updateInterfaceSpecifier();
        
        for ( var i = 0; i < list.children.length; i++ ) {
            
            var info = this.element_metainf.getInformation( list.children[i].querySelector( 'div' ) );
            
            if ( !info ) {
                return;
            }
            set.push( info );
        }
        
        return set;
    }
    
    this.putInformation = function( info, block ) {
        var list = block.querySelector( 'ul' ),
              i = 0;
              
        this.element_metainf.resetSpecifiers();
        this.element_metainf.updateSpecifier();
        this.element_metainf.updateInterfaceSpecifier();
        
        if ( list.children.length > 0 ) {
            this.element_metainf.putInformation( info[i], list.lastChild.querySelector( 'div' ) );
            i++;
        }
        
        if ( info ) {
            for ( ; i < info.length; i++ ) {
                block.lastChild.children[0].click();
                this.element_metainf.putInformation( info[i], list.lastChild.querySelector( 'div' ) );
            }     
        }
    }
    
    function get_set_block( element_metainf, title ) {
        var set_block = document.createElement( 'div' ),
              elements = document.createElement( 'ul' );
        $(set_block).addClass("set_block");
        
        if ( title ) {
            var ttl = document.createElement( 'h3' );
            ttl.textContent = title;
            set_block.appendChild( ttl );
            element_metainf.specifiers.push( SPECIFIER.PROXY );
        }
        
        set_block.appendChild( elements );      

        if ( !element_metainf ) return set_block;
        
        element_metainf.resetSpecifiers();
        element_metainf.updateSpecifier();
        element_metainf.updateInterfaceSpecifier();       
        
        return set_block;
    }
    
    function get_add_button( set_class ) { 
        var btn = new Button( "+", function() {
            set_class.elements_count++;
            var element = document.createElement( 'li' );
            element.appendChild( set_class.element_metainf.getEditInterface() );
            set_class.set_block.querySelector( 'ul' ).appendChild( element );
            
            update_buttons( set_class );
        });
        
        return btn;
    }
    
    function get_delete_button( set_class ) { 
        var btn = new Button( "-", function() { 
            set_class.elements_count--;
            set_class.set_block.querySelector( 'ul' ).lastChild.remove();
            
            update_buttons( set_class );
        });
        
        return btn;
    }
    
    function update_buttons( set_class ) {
        set_class.delete_btn.disabled = !( set_class.elements_count > set_class.min_elements );
        set_class.add_btn.disabled = !( set_class.elements_count < set_class.max_elements );
    }
};function Complex( root ) {

    if ( root.interface_specifier != INTERFACE_SPECIFIER.COMPLEX ) return;
    
    var root = clone( root );
    
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );
    this.element_metainf = root;
    
    this.complex_block;
    
    this.getEditInterface = function() {
        this.complex_block = get_complex_block( this.element_metainf, this.title );
        
        return this.complex_block;
    };
    
    this.getInformation = function( block ) {  
        var children = block.children, 
              title_shift = ( block.children[0].nodeName == "H2" ? 1 : 0),        
              vertex = new Vertex( this.element_metainf.name, 
                                            this.element_metainf.specifiers,
                                            this.element_metainf.interface_specifier,
                                            this.element_metainf.sort );
         
        for ( var i = 0; i < this.element_metainf.children.length; i++ ) { 
            var info = this.element_metainf.children[i].getInformation( children[i + title_shift] );
            
            if ( !info ) {
                return;
            } else if ( info.length ) {
                for ( var j = 0; j < info.length; j++ ) {
                    vertex.children.push( info[j] );
                }
            } else {
                vertex.children.push( info );
            }
        }
        return vertex;
    }
    
    this.putInformation = function( info, block ) {  
        var children = block.children, 
              title_shift = ( block.children[0].nodeName == "H2" ? 1 : 0),
              k = 0;
              
        for ( var i = 0; i < this.element_metainf.children.length; i++ ) {
            if ( in_array( this.element_metainf.children[i].interface_specifier, [INTERFACE_SPECIFIER.SET] ) ) {
                var elementsOfSet = new Array();
                while ( info.children[i + k] && this.element_metainf.children[i].name == info.children[i + k].name ) {
                    elementsOfSet.push( info.children[i + k] );
                    k++;
                }
                k--;
                this.element_metainf.children[i].putInformation( elementsOfSet, children[i + title_shift] );
            } else {
                this.element_metainf.children[i].putInformation( info.children[i + k], children[i + title_shift] );
            }
        }
    }
    
    function get_complex_block( element_metainf, title ) {
        var complex_block = document.createElement( 'div' );
        $(complex_block).addClass("complex_block");
        
        if ( title ) {
            var ttl = document.createElement( 'h2' );
            ttl.textContent = title;
            complex_block.appendChild( ttl );
        }
        
        if ( !element_metainf ) return complex_block;
        
        for ( var i = 0; i < element_metainf.children.length; i++ ) {
            var element = element_metainf.children[i].getEditInterface();   
            complex_block.appendChild( element );
        }
        
        return complex_block;
    }
};function Alt( root ) {

    if ( root.interface_specifier != INTERFACE_SPECIFIER.ALT ) return;
    
    var root = clone( root );
    
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );
    this.element_metainf = root;
    
    this.alt_block;
    
    this.getEditInterface = function() {
        this.alt_block = get_alt_block( this.element_metainf, this.title );
        
        return this.alt_block;
    };
    
    this.getInformation = function( block ) { 
        var list = block.querySelector( 'select' ),
              vertex = new Vertex( this.element_metainf.name, [], "", null );
              
        if  ( this.element_metainf.children[list.value].interface_specifier == INTERFACE_SPECIFIER.TERMINAL_VALUE ) {
            vertex.children.push( this.element_metainf.children[list.value] );
        } else {
            var info = this.element_metainf.children[list.value].getInformation( block.querySelector( 'div' ) );
            vertex.children.push( info );
        }
        
        return vertex;
    }
    
    this.putInformation = function( info, block ) {
        var list = block.querySelector( 'select' ),
              k = 0;
              console.log(info, block)
        for ( var i = 0; i < list.length; i++ ) {
            if ( ( info.children[0].name != "" && this.element_metainf.children[i].name == info.children[0].name )
                    || ( info.children[0].name == "" && this.element_metainf.children[i].sort == info.children[0].sort ) 
                ) {
                
                list[i].selected = true;
                $( list ).trigger( 'change' ); 
                
                if ( this.element_metainf.children[i].interface_specifier == INTERFACE_SPECIFIER.SET ) {
                    this.element_metainf.children[i].putInformation( info.children, block.querySelector( 'div' ) );
                } else {
                    this.element_metainf.children[i].putInformation( info.children[0], block.querySelector( 'div' ) );
                }
                break;
            }            
        }
    }
    
    function get_alt_block( element_metainf, title ) {
        var alt_block = document.createElement( 'div' ),
              select = document.createElement( 'select' );
        $(alt_block).addClass("alt_block");
        
        if ( title ) {
            var ttl = document.createElement( 'h1' );
            ttl.textContent = title;
            alt_block.appendChild( ttl );
        }        
        
        for ( var i = 0; i < element_metainf.children.length; i++ ) {
            var option = document.createElement( 'option' );
            if ( element_metainf.children[i].sort ) {
                if ( element_metainf.children[i].sort.match( TERMINAL.SORT.REGULAR_EXPR ) ) {
                    option.text = element_metainf.children[i].name;
                } else {
                    option.text = element_metainf.children[i].sort.match( TERMINAL.VALUE.REGULAR_EXPR )[0];
                }
            } else {
                option.text = element_metainf.children[i].name;
            }
            option.value = i;
            option.name = element_metainf.children[i].name;
            select.add( option );
        }
        
        alt_block.appendChild( select );
        if ( !element_metainf.children[select.value].sort || element_metainf.children[select.value].sort.match( TERMINAL.SORT.REGULAR_EXPR ) ) {
            alt_block.appendChild( element_metainf.children[select.value].getEditInterface() );
        }
        
        select.onchange = function() {
            if ( alt_block.querySelector( 'div' ) )
                alt_block.querySelector( 'div' ).remove();
            if ( !element_metainf.children[select.value].sort || element_metainf.children[select.value].sort.match( TERMINAL.SORT.REGULAR_EXPR ) ) {
                alt_block.appendChild( element_metainf.children[select.value].getEditInterface() );
            }
        }
        
        return alt_block;
    }
};function Boolean( root ) {
    
    if ( root.interface_specifier != INTERFACE_SPECIFIER.BOOLEAN ) return;
    
    var root = clone( root );
    
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );
    this.element_metainf = root;
    
    this.boolean_block;
    
    this.getEditInterface = function() {
        this.boolean_block = get_boolean_block( this.element_metainf, this.title );
        
        return this.boolean_block;
    }
    
    this.getInformation = function( block ) {
        var value = TO.BOOL( block.querySelector( 'input' ).checked );
        
        if ( value.match( TERMINAL.VALUE.BOOL ) ) {
            $(block).removeClass("error");
            return new Vertex( this.element_metainf.name, [], "", value );
        }
        $(block).addClass("error");
        return;
    }
    
    this.putInformation = function( info, block ) {
        block.querySelector( 'input' ).checked = ( FROM.BOOL( info.sort ) == 'true' ? true : false );
    }
    
    function get_boolean_block( element_metainf, title ) {
        var boolean_block = document.createElement( 'div' ),
              label = document.createElement( 'label' ),
              input = document.createElement( 'input' );
        $(boolean_block).addClass("boolean_block");
        input.type = "checkbox";
        
        label.appendChild( input );
        
        if ( title ) {
            var ttl = document.createElement( 'span' );
            ttl.textContent = title;
            label.appendChild( ttl );
            element_metainf.specifiers.push( SPECIFIER.PROXY );
        }
        
        boolean_block.appendChild( label );
        
        return boolean_block;
    }
};function Datetime( root ) {

    if ( root.interface_specifier != INTERFACE_SPECIFIER.DATETIME ) return;
    
    var root = clone( root );
    
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );
    this.element_metainf = root;
    
    this.datetime_block;
    
    this.getEditInterface = function() {
        this.datetime_block = get_datetime_block( this.element_metainf, this.title );
        
        return this.datetime_block;
    }
    
    this.getInformation = function( block ) {
        var value = TO.DATE( block.querySelector( 'input' ).value );
        
        if ( value.match( TERMINAL.VALUE.DATE ) ) {
            $(block).removeClass("error");
            return new Vertex( this.element_metainf.name, [], "", value );
        }
        $(block).addClass("error");
        return;
    }
    
    this.putInformation = function( info, block ) {
        block.querySelector( 'input' ).value = FROM.DATE( info.sort );
    }
    
    function get_datetime_block( element_metainf, title ) {
        var datetime_block = document.createElement( 'div' ),
              label = document.createElement( 'label' ),
              input = document.createElement( 'input' );
        $(datetime_block).addClass("datetime_block");
        input.type = "datetime-local";       
        
        if ( title ) {
            var ttl = document.createElement( 'span' );
            ttl.textContent = title;
            label.appendChild( ttl );
            element_metainf.specifiers.push( SPECIFIER.PROXY );
        }
        label.appendChild( input );
        
        datetime_block.appendChild( label );
        
        return datetime_block;
    }
};function String( root ) {

    if ( root.interface_specifier != INTERFACE_SPECIFIER.STRING ) return;
    
    var root = clone( root );
    
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );
    this.element_metainf = root;
    
    this.string_block;
    
    this.getEditInterface = function() {
        this.string_block = get_string_block( this.element_metainf, this.title );
        
        return this.string_block;
    }
    
    this.getInformation = function( block ) {
        var value = TO.STR( block.querySelector( 'input' ).value );
        
        if ( value.match( TERMINAL.VALUE.STR ) ) {
            $(block).removeClass("error");
            return new Vertex( this.element_metainf.name, [], "", value );
        }
        
        $(block).addClass("error");
        return;
    }
    
    this.putInformation = function( info, block ) {
        block.querySelector( 'input' ).value = FROM.STR( info.sort );
    }
    
    function get_string_block( element_metainf, title ) {
        var string_block = document.createElement( 'div' ),
              label = document.createElement( 'label' ),
              input = document.createElement( 'input' );
        $(string_block).addClass("string_block");
        
        if ( title ) {
            var ttl = document.createElement( 'span' );
            ttl.textContent = title;
            label.appendChild( ttl );
            element_metainf.specifiers.push( SPECIFIER.PROXY );
        }
        
        label.appendChild( input );
        
        string_block.appendChild( label );
        
        return string_block;
    }
};function Integer( root ) {

    if ( root.interface_specifier != INTERFACE_SPECIFIER.INTEGER ) return;
    
    var root = clone( root );
    
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );
    this.element_metainf = root;
    
    this.integer_block;
    
    this.getEditInterface = function() {
        this.integer_block = get_integer_block( this.element_metainf, this.title );
        
        return this.integer_block;
    }
    
    this.getInformation = function( block ) { 
        var value = TO.INT( block.querySelector( 'input' ).value );
        
        if ( value.match( TERMINAL.VALUE.INT ) ) {
            $(block).removeClass("error");
            return new Vertex( this.element_metainf.name, [], "", value );
        }
        
        $(block).addClass("error");
        return;
    }
    
    this.putInformation = function( info, block ) {
        block.querySelector( 'input' ).value = FROM.INT( info.sort );
    }
    
    function get_integer_block( element_metainf, title ) {
        var integer_block = document.createElement( 'div' ),
              label = document.createElement( 'label' ),
              input = document.createElement( 'input' );
        $(integer_block).addClass("integer_block");
        
        if ( title ) {
            var ttl = document.createElement( 'span' );
            ttl.textContent = title;
            label.appendChild( ttl );
            element_metainf.specifiers.push( SPECIFIER.PROXY );
        }
        label.appendChild( input );
        
        integer_block.appendChild( label );
        
        return integer_block;
    }
};function Real( root ) {

    if ( root.interface_specifier != INTERFACE_SPECIFIER.REAL ) return;
    
    var root = clone( root );
    
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );
    this.element_metainf = root;
    
    this.real_block;
    
    this.getEditInterface = function() {
        this.real_block = get_real_block( this.element_metainf, this.title );
        
        return this.real_block;
    }
    
    this.getInformation = function( block ) {
        var value = TO.REAL( block.querySelector( 'input' ).value );
        
        if ( value.match( TERMINAL.VALUE.REAL ) ) {
            $(block).removeClass("error");
            return new Vertex( this.element_metainf.name, [], "", value );
        }
        
        $(block).addClass("error");
        return;
    }
    
    this.putInformation = function( info, block ) {
        block.querySelector( 'input' ).value = FROM.REAL( info.sort );
    }
    
    function get_real_block( element_metainf, title ) {
        var real_block = document.createElement( 'div' ),
              label = document.createElement( 'label' ),
              input = document.createElement( 'input' );
        $(real_block).addClass("real_block");
        
        if ( title ) {
            var ttl = document.createElement( 'span' );
            ttl.textContent = title;
            label.appendChild( ttl );
            element_metainf.specifiers.push( SPECIFIER.PROXY );
        }
        label.appendChild( input );
        
        real_block.appendChild( label );
        
        return real_block;
    }
};function Blob( root ) {

    if ( root.interface_specifier != INTERFACE_SPECIFIER.BLOB ) return;
    
    var root = clone( root );
    
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );
    this.element_metainf = root;
    
    this.blob_block;
    
    this.getEditInterface = function() {
        this.blob_block = get_blob_block( this.element_metainf, this.title );
        
        return this.blob_block;
    }
    
    this.getInformation = function( block ) {
        var value = TO.BLOB( block.querySelector( 'input' ).value );
        
        if ( value.match( TERMINAL.VALUE.BLOB ) ) {
            $(block).removeClass("error");
            return new Vertex( this.element_metainf.name, [], "", value );
        }
        $(block).addClass("error");
        return;
    }
    
    this.putInformation = function( info, block ) {
        block.querySelector( 'input' ).value = FROM.BLOB( info.sort );
    }
    
    function get_blob_block( element_metainf, title ) {
        var blob_block = document.createElement( 'div' ),
              label = document.createElement( 'label' ),
              input = document.createElement( 'input' );
        $(blob_block).addClass("blob_block");
        
        if ( title ) {
            var ttl = document.createElement( 'span' );
            ttl.textContent = title;
            label.appendChild( ttl );
            element_metainf.specifiers.push( SPECIFIER.PROXY );
        }
        label.appendChild( input );
        
        blob_block.appendChild( label );
        
        return blob_block;
    }
};function TerminalValue( root ) {
    
    if ( root.interface_specifier != INTERFACE_SPECIFIER.TERMINAL_VALUE ) return;
    
    var root = clone( root );
    
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );
    this.element_metainf = root;
    
    this.terminal_value_block;
    
    this.getEditInterface = function() {
        this.terminal_value_block = get_terminal_value_block( this.element_metainf, this.title );
        
        return this.terminal_value_block;
    }
    
    this.getInformation = function( block ) {
        var value = this.element_metainf.sort;
        return new Vertex( this.element_metainf.name, [], "", value );
    }
    
    this.putInformation = function( info, block ) {
        
    }
    
    function get_terminal_value_block( element_metainf, title ) {
        var terminal_value_block = document.createElement( 'div' ),
              value_block = document.createElement( 'span' ),
              value = element_metainf.sort.match( TERMINAL.VALUE.REGULAR_EXPR );
        
        $(terminal_value_block).addClass("terminal_value_block");
        
        value_block.textContent = ( value ? value[0] : "" );
        
        if ( title ) {
            var ttl = document.createElement( 'span' );
            ttl.textContent = title + " ";
            terminal_value_block.appendChild( ttl );
            element_metainf.specifiers.push( SPECIFIER.PROXY );
        }
        
        terminal_value_block.appendChild( value_block );
        
        return terminal_value_block;
    }
}
    $.fn.tableRepresentation = function(options) {
        var data = this.data('table-representation');
        if (data) {
            return data;
        }

        var settings = $.extend({
            orientation: 'HORIZONTAL'
        }, options || {});

        var meta = IrParser().toJson( this.data('tpir-meta') );
        //var meta = IrToJson( tpir );
        // var info = IrToJson( $( input_info_field ).val() );
        
        var interface_block = meta.children[0].getEditInterface();
        this.append( interface_block );
        // if ( info.children[0] ) { 
        //     meta.children[0].putInformation( info.children[0], interface_block );
        // }      

        /**  TODO: refactor */
        var self = $.extend(this, {
        //    refresh: function() {
        //        var new_width = this.width();
        //        var new_height = this.height();
        //        if (width != new_width || height != new_height) {
        //            width = this.width();
        //            height = this.height();
        //            self.position(position);
        //        }
        //    },
        //    position: (function() {
        //        if (settings.orientation == 'vertical') {
        //            return function(n, silent) {
        //                if (n === undefined) {
        //                    return position;
        //                } else {
        //                    position = get_position(n);
        //                    var sw = splitter.width()/2;
        //                    splitter.css('left', position-sw);
        //                    panel_1.width(position-sw);
        //                    panel_2.width(self.width()-position-sw);
        //                }
        //                if (!silent) {
        //                    self.find('.splitter_panel').trigger('splitter.resize');
        //                }
        //                return self;
        //            };
        //        } else if (settings.orientation == 'horizontal') {
        //            return function(n, silent) {
        //                if (n === undefined) {
        //                    return position;
        //                } else {
        //                    position = get_position(n);
        //                    var sw = splitter.height()/2;
        //                    splitter.css('top', position-sw);
        //                    panel_1.height(position-sw);
        //                    panel_2.height(self.height()-position-sw);
        //                }
        //                if (!silent) {
        //                    self.find('.splitter_panel').trigger('splitter.resize');
        //                }
        //                return self;
        //            };
        //        } else {
        //            return $.noop;
        //        }
        //    })(),
            orientation: settings.orientation
        //    destroy: function() {
        //        self.removeClass('splitter_panel');
        //        splitter.unbind('mouseenter');
        //        splitter.unbind('mouseleave');
        //        if (settings.orientation == 'vertical') {
        //            panel_1.removeClass('left_panel');
        //            panel_2.removeClass('right_panel');
        //        } else if (settings.orientation == 'horizontal') {
        //            panel_1.removeClass('top_panel');
        //            panel_2.removeClass('bottom_panel');
        //        }
        //        self.unbind('splitter.resize');
        //        self.find('.splitter_panel').trigger('splitter.resize');
        //        splitters[id] = null;
        //        splitter.remove();
        //        var not_null = false;
        //        for (var i=splitters.length; i--;) {
        //            if (splitters[i] !== null) {
        //                not_null = true;
        //                break;
        //            }
        //        }
        //        //remove document events when no splitters
        //        if (!not_null) {
        //            $(document.documentElement).unbind('.splitter');
        //            $(window).unbind('resize.splitter');
        //            splitters = [];
        //        }
        //    }
        });
        //self.bind('splitter.resize', function(e) {
        //    var pos = self.position();
        //    if (self.orientation == 'vertical' &&
        //        pos > self.width()) {
        //        pos = self.width() - self.limit-1;
        //    } else if (self.orientation == 'horizontal' &&
        //        pos > self.height()) {
        //        pos = self.height() - self.limit-1;
        //    }
        //    if (pos < self.limit) {
        //        pos = self.limit + 1;
        //    }
        //    self.position(pos, true);
        //});
        ////inital position of splitter
        //var pos;
        //if (settings.orientation == 'vertical') {
        //    if (pos > width-settings.limit) {
        //        pos = width-settings.limit;
        //    } else {
        //        pos = get_position(settings.position);
        //    }
        //} else if (settings.orientation == 'horizontal') {
        //    //position = height/2;
        //    if (pos > height-settings.limit) {
        //        pos = height-settings.limit;
        //    } else {
        //        pos = get_position(settings.position);
        //    }
        //}
        //if (pos < settings.limit) {
        //    pos = settings.limit;
        //}
        //self.position(pos, true);
        //if (splitters.length == 0) { // first time bind events to document
        //    $(window).bind('resize.splitter', function() {
        //        $.each(splitters, function(i, splitter) {
        //            splitter.refresh();
        //        });
        //    });
        //    $(document.documentElement).bind('mousedown.splitter', function(e) {
        //        if (splitter_id !== null) {
        //            current_splitter = splitters[splitter_id];
        //            $('<div class="splitterMask"></div>').insertAfter(current_splitter);
        //            if (current_splitter.orientation == 'horizontal') {
        //                $('body').css('cursor', 'row-resize');
        //            } else if (current_splitter.orientation == 'vertical') {
        //                $('body').css('cursor', 'col-resize');
        //            }
        //            settings.onDragStart(e);
        //            return false;
        //        }
        //    }).bind('mouseup.splitter', function(e) {
        //        $('.splitterMask').remove();
        //        current_splitter = null;
        //        $('body').css('cursor', 'auto');
        //        settings.onDragEnd(e);
        //    }).bind('mousemove.splitter', function(e) {
        //        if (current_splitter !== null) {
        //            var limit = current_splitter.limit;
        //            var offset = current_splitter.offset();
        //            if (current_splitter.orientation == 'vertical') {
        //                var x = e.pageX - offset.left;
        //                if(x <= current_splitter.limit) {
        //                    x = current_splitter.limit + 1;
        //                }
        //                else if (x >= current_splitter.width() - limit) {
        //                    x = current_splitter.width() - limit - 1;
        //                }
        //                if (x > current_splitter.limit &&
        //                    x < current_splitter.width()-limit) {
        //                    current_splitter.position(x, true);
        //                    current_splitter.find('.splitter_panel').trigger('splitter.resize');
        //                    return false;
        //                }
        //            } else if (current_splitter.orientation == 'horizontal') {
        //                var y = e.pageY-offset.top;
        //                if(y <= current_splitter.limit) {
        //                    y = current_splitter.limit + 1;
        //                }
        //                else if (y >= current_splitter.height() - limit) {
        //                    y = current_splitter.height() - limit - 1;
        //                }
        //                if (y > current_splitter.limit &&
        //                    y < current_splitter.height()-limit) {
        //                    current_splitter.position(y, true);
        //                    current_splitter.trigger('splitter.resize');
        //                    return false;
        //                }
        //            }
        //            settings.onDrag(e);
        //        }
        //    });
        //}
        //splitters.push(self);

        self.data('table-representation', self);

        return self;
    };
})( jQuery );
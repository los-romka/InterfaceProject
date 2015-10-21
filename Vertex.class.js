;function Vertex( name, specifiers, interface_specifier, sort ) {
    this.name = name;
    this.specifiers = specifiers;
    this.interface_specifier = interface_specifier;
    this.sort = sort;
    this.children = [];
}

Vertex.prototype.resetSpecifiers = function() {
    if ( this.specifiers ) {
        for ( var i = this.specifiers.length - 1; i >= 0 ; i-- ) {
            if ( this.specifiers[i] == SPECIFIER.SET || this.specifiers[i] == SPECIFIER.SETMM || this.specifiers[i] == SPECIFIER.ONEMM ) {
                this.specifiers.splice( i, 1 );
            }
        }
    }

    this.interface_specifier = INTERFACE_SPECIFIER.UNDEFINED;
};

Vertex.prototype.updateSpecifier = function() {
    if ( !in_array( SPECIFIER.SET, this.specifiers ) && !in_array( SPECIFIER.SETMM, this.specifiers )
        && !in_array( SPECIFIER.COPY, this.specifiers ) && !in_array( SPECIFIER.COPYMM, this.specifiers )
        && !in_array( SPECIFIER.ONE, this.specifiers ) && !in_array( SPECIFIER.ONEMM, this.specifiers ) ) {

        this.specifiers.push( ( this.sort ? SPECIFIER.ONE : SPECIFIER.COPY) );
    }
    return this;
};

Vertex.prototype.updateInterfaceSpecifier = function() {
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
};

Vertex.prototype.getEditInterface = function() {
    var edit_interface;

    switch ( this.interface_specifier ) {
        case INTERFACE_SPECIFIER.TABLE : edit_interface = ( new Table( this ) ).getEditInterface(); break;
        case INTERFACE_SPECIFIER.ALT : edit_interface = ( new Alt( this ) ).getEditInterface(); break;
        case INTERFACE_SPECIFIER.SET : edit_interface = ( new Set( this ) ).getEditInterface(); break;
        case INTERFACE_SPECIFIER.COMPLEX : edit_interface = ( new Complex( this ) ).getEditInterface(); break;
        case INTERFACE_SPECIFIER.BOOLEAN : edit_interface = BooleanVertex( $(this) ); break;
        case INTERFACE_SPECIFIER.DATETIME : edit_interface = DatetimeVertex( $(this) ); break;
        case INTERFACE_SPECIFIER.STRING : edit_interface = StringVertex( $(this) ); break;
        case INTERFACE_SPECIFIER.INTEGER : edit_interface = IntegerVertex( $(this) ); break;
        case INTERFACE_SPECIFIER.REAL : edit_interface = RealVertex( $(this) ); break;
        case INTERFACE_SPECIFIER.BLOB : edit_interface = BlobVertex( $(this) ); break;
        case INTERFACE_SPECIFIER.TERMINAL_VALUE : edit_interface = TerminalVertex( $(this) ); break;
        default : {
            edit_interface = document.createElement( 'div' );
            edit_interface.textContent = "Что-то пошло не так...";
            break;
        }
    }

    return edit_interface;
};

Vertex.prototype.getInformation = function( block ) {
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

Vertex.prototype.putInformation = function( info, block ) {
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
}

;function AbstractVertex( $block, meta ) {
    if (meta.interface_specifier == INTERFACE_SPECIFIER.UNDEFINED) {
        if ( meta.interface_specifier == INTERFACE_SPECIFIER.UNDEFINED
            && ( in_array( SPECIFIER.SET, meta.specifiers ) || in_array( SPECIFIER.SETMM, meta.specifiers ) || in_array( SPECIFIER.ONEMM, meta.specifiers ) ) ) {
            meta.interface_specifier = INTERFACE_SPECIFIER.SET;
        } else if ( meta.sort && meta.interface_specifier == INTERFACE_SPECIFIER.UNDEFINED ) {
            switch ( meta.sort ) {
                case TERMINAL.SORT.STR : meta.interface_specifier = INTERFACE_SPECIFIER.STRING; break;
                case TERMINAL.SORT.INT : meta.interface_specifier = INTERFACE_SPECIFIER.INTEGER; break;
                case TERMINAL.SORT.REAL : meta.interface_specifier = INTERFACE_SPECIFIER.REAL; break;
                case TERMINAL.SORT.BOOL : meta.interface_specifier = INTERFACE_SPECIFIER.BOOLEAN; break;
                case TERMINAL.SORT.DATE : meta.interface_specifier = INTERFACE_SPECIFIER.DATETIME; break;
                case TERMINAL.SORT.BLOB : meta.interface_specifier = INTERFACE_SPECIFIER.BLOB; break;
                default : {
                    if ( meta.sort.match( TERMINAL.VALUE.STR ) || meta.sort.match( TERMINAL.VALUE.INT )
                        || meta.sort.match( TERMINAL.VALUE.REAL ) || meta.sort.match( TERMINAL.VALUE.BOOL )
                        || meta.sort.match( TERMINAL.VALUE.DATE ) || meta.sort.match( TERMINAL.VALUE.BLOB ) ) {
                        meta.interface_specifier = INTERFACE_SPECIFIER.TERMINAL_VALUE;
                    } else {
                        meta.interface_specifier = INTERFACE_SPECIFIER.UNDEFINED;
                    }
                    break;
                }
            }
        } else if ( in_array( SPECIFIER.ALT, meta.specifiers ) && meta.interface_specifier == INTERFACE_SPECIFIER.UNDEFINED )  {
            meta.interface_specifier = INTERFACE_SPECIFIER.ALT;
        } else if ( !meta.sort && meta.interface_specifier == INTERFACE_SPECIFIER.UNDEFINED )  {
            meta.interface_specifier = INTERFACE_SPECIFIER.COMPLEX;
        } else if ( meta.interface_specifier == INTERFACE_SPECIFIER.UNDEFINED ){
            meta.interface_specifier = INTERFACE_SPECIFIER.UNDEFINED;
        }
    }

    var _class;

    switch ( meta.interface_specifier ) {
        //case INTERFACE_SPECIFIER.TABLE : edit_interface = ( new Table( this ) ).getEditInterface(); break;
        case INTERFACE_SPECIFIER.ALT :            _class = AltVertex; break;
        //case INTERFACE_SPECIFIER.SET : edit_interface = ( new Set( this ) ).getEditInterface(); break;
        case INTERFACE_SPECIFIER.COMPLEX :        _class = ComplexVertex; break;
        case INTERFACE_SPECIFIER.BOOLEAN :        _class = BooleanVertex; break;
        case INTERFACE_SPECIFIER.DATETIME :       _class = DatetimeVertex; break;
        case INTERFACE_SPECIFIER.STRING :         _class = StringVertex; break;
        case INTERFACE_SPECIFIER.INTEGER :        _class = IntegerVertex; break;
        case INTERFACE_SPECIFIER.REAL :           _class = RealVertex; break;
        case INTERFACE_SPECIFIER.BLOB :           _class = BlobVertex; break;
        case INTERFACE_SPECIFIER.TERMINAL_VALUE : _class = TerminalVertex; break;
        default :                                 _class = function() {return null;}
    }

    return _class( $block, meta );
}
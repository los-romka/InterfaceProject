;function Vertex( name, specifiers, interface_specifier, sort ) {
    this.name = name;
    this.specifiers = specifiers;
    this.interface_specifier = interface_specifier;
    this.interface_params = {};
    this.sort = sort;
    this.children = [];
}

Vertex.prototype.transformToCollection = function(orientation) {
    this.interface_params = {
        ORIENTATION: orientation
    };

    this.interface_specifier = INTERFACE_SPECIFIER.COLLECTION;
};

Vertex.prototype.simplifyCollection = function() {
    if ( this.specifiers ) {
        for ( var i = this.specifiers.length - 1; i >= 0 ; i-- ) {
            if ( in_array(this.specifiers[i], [SPECIFIER.SET, SPECIFIER.SETMM, SPECIFIER.LIST, SPECIFIER.LISTMM, SPECIFIER.ONEMM]) ) {
                this.specifiers.splice( i, 1 );
            }
        }
    }

    this.interface_specifier = INTERFACE_SPECIFIER.UNDEFINED;

    return this;
};

Vertex.prototype.updateSpecifier = function() {
    if ( intersect( this.specifiers, [
            SPECIFIER.SET, SPECIFIER.SETMM,
            SPECIFIER.LIST, SPECIFIER.LISTMM,
            SPECIFIER.COPY, SPECIFIER.COPYMM,
            SPECIFIER.ONE, SPECIFIER.ONEMM ] ).length === 0 ) {

        this.specifiers.push( ( this.sort ? SPECIFIER.ONE : SPECIFIER.COPY) );
    }
    return this;
};

Vertex.prototype.updateInterfaceSpecifier = function() {
    if (this.interface_specifier == INTERFACE_SPECIFIER.UNDEFINED) {
        if ( intersect([SPECIFIER.SET,SPECIFIER.SETMM,
                SPECIFIER.LIST,SPECIFIER.LISTMM,
                SPECIFIER.ONEMM], this.specifiers).length > 0 ) {
            this.interface_specifier = INTERFACE_SPECIFIER.COLLECTION;
        } else if ( this.sort ) {
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
        } else if ( in_array( SPECIFIER.ALT, this.specifiers ) )  {
            this.interface_specifier = INTERFACE_SPECIFIER.ALT;
        } else {
            this.interface_specifier = INTERFACE_SPECIFIER.COMPLEX;
        }
    }

    return this;
};

;function AbstractVertex( $block, meta ) {
    meta.updateInterfaceSpecifier();

    var _class;

    switch ( meta.interface_specifier ) {
        case INTERFACE_SPECIFIER.COLLECTION :     _class = CollectionVertex; break;

        case INTERFACE_SPECIFIER.ALT :            _class = AltVertex; break;
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
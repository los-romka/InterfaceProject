;function Vertex( name, specifiers, interface_specifier, sort ) {
    this.name = name;
    this.specifiers = specifiers;
    this.interface_specifier = interface_specifier;
    this.interface_params = {};
    this.sort = sort;
    this.children = [];
    this.produced = false;
}

Vertex.prototype.produce = function() {
    this.produced = true;
};

Vertex.prototype.transformToCollection = function(orientation) {
    var traversal = [],
        queue = [],
        collection;

    queue.push( this );

    while ( queue.length ) {
        var current = queue.pop();

        if ( !in_array( current, traversal ) ) {
            traversal.push( current );

            if ( intersect(current.specifiers, [SPECIFIER.SET, SPECIFIER.SETMM, SPECIFIER.LIST, SPECIFIER.LISTMM, SPECIFIER.ONE, SPECIFIER.ONEMM]).length > 0 ) {
                collection = current;
                break;
            }

            for ( var i = 0; i < current.children.length; i++ ) {
                queue.push( current.children[i] );
            }
        }
    }

    if (!collection) {
        collection = this;
    }

    collection.interface_params = {
        ORIENTATION: orientation
    };

    collection.interface_specifier = INTERFACE_SPECIFIER.COLLECTION;

    return this;
};

Vertex.prototype.simplifyCollection = function() {
    if ( this.specifiers ) {
        for ( var i = this.specifiers.length - 1; i >= 0 ; i-- ) {
            if ( in_array(this.specifiers[i], [SPECIFIER.SET, SPECIFIER.SETMM, SPECIFIER.LIST, SPECIFIER.LISTMM, SPECIFIER.ONE, SPECIFIER.ONEMM]) ) {
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

Vertex.prototype.getInterfaceSpecifier = function() {
    var interface_specifier = "";

    if (interface_specifier == INTERFACE_SPECIFIER.UNDEFINED) {
        if ( intersect([SPECIFIER.SET,SPECIFIER.SETMM,
                SPECIFIER.LIST,SPECIFIER.LISTMM,
                SPECIFIER.ONEMM], this.specifiers).length > 0
            || (in_array(SPECIFIER.ONE, this.specifiers) && !this.sort)
        ) {
            interface_specifier = INTERFACE_SPECIFIER.COLLECTION;
        } else if ( this.sort ) {
            switch ( this.sort ) {
                case TERMINAL.SORT.STR : interface_specifier = INTERFACE_SPECIFIER.STRING; break;
                case TERMINAL.SORT.INT : interface_specifier = INTERFACE_SPECIFIER.INTEGER; break;
                case TERMINAL.SORT.REAL : interface_specifier = INTERFACE_SPECIFIER.REAL; break;
                case TERMINAL.SORT.BOOL : interface_specifier = INTERFACE_SPECIFIER.BOOLEAN; break;
                case TERMINAL.SORT.DATE : interface_specifier = INTERFACE_SPECIFIER.DATETIME; break;
                case TERMINAL.SORT.BLOB : interface_specifier = INTERFACE_SPECIFIER.BLOB; break;
                default : {
                    if ( this.sort.match( TERMINAL.VALUE.STR ) || this.sort.match( TERMINAL.VALUE.INT )
                        || this.sort.match( TERMINAL.VALUE.REAL ) || this.sort.match( TERMINAL.VALUE.BOOL )
                        || this.sort.match( TERMINAL.VALUE.DATE ) || this.sort.match( TERMINAL.VALUE.BLOB ) ) {
                        interface_specifier = INTERFACE_SPECIFIER.TERMINAL_VALUE;
                    } else {
                        interface_specifier = INTERFACE_SPECIFIER.UNDEFINED;
                    }
                    break;
                }
            }
        } else if ( in_array( SPECIFIER.ALT, this.specifiers ) )  {
            interface_specifier = INTERFACE_SPECIFIER.ALT;
        } else {
            interface_specifier = INTERFACE_SPECIFIER.COMPLEX;
        }
    }

    return interface_specifier;
};

Vertex.prototype.updateInterfaceSpecifier = function() {
    this.interface_specifier = this.getInterfaceSpecifier();

    return this;
};

Vertex.prototype.toHtmlName = function() {
    return (this.name + (this.sort ? ' ' + TRANSLATE_SORT[this.sort] : ''));
};
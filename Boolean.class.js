function Boolean( root ) {
    
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
}
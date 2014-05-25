function String( root ) {

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
}
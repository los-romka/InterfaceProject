;function Integer( root ) {

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
}
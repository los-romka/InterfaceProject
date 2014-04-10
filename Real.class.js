function Real( root ) {

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
}
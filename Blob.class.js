;function Blob( root ) {

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
}
;function Datetime( root ) {

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
}
function TerminalValue( root ) {
    
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
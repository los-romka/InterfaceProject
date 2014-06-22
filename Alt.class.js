function Alt( root ) {

    if ( root.interface_specifier != INTERFACE_SPECIFIER.ALT ) return;
    
    var root = clone( root );
    
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );
    this.element_metainf = root;
    
    this.alt_block;
    
    this.getEditInterface = function() {
        this.alt_block = get_alt_block( this.element_metainf, this.title );
        
        return this.alt_block;
    };
    
    this.getInformation = function( block ) { 
        var list = block.querySelector( 'select' ),
              vertex = new Vertex( this.element_metainf.name, [], "", null );
              
        if  ( this.element_metainf.children[list.value].interface_specifier == INTERFACE_SPECIFIER.TERMINAL_VALUE ) {
            vertex.children.push( this.element_metainf.children[list.value] );
        } else {
            var info = this.element_metainf.children[list.value].getInformation( block.querySelector( 'div' ) );
            vertex.children.push( info );
        }
        
        return vertex;
    }
    
    this.putInformation = function( info, block ) {
        var list = block.querySelector( 'select' ),
              k = 0;
              console.log(info, block)
        for ( var i = 0; i < list.length; i++ ) {
            if ( ( info.children[0].name != "" && this.element_metainf.children[i].name == info.children[0].name )
                    || ( info.children[0].name == "" && this.element_metainf.children[i].sort == info.children[0].sort ) 
                ) {
                
                list[i].selected = true;
                $( list ).trigger( 'change' ); 
                
                if ( this.element_metainf.children[i].interface_specifier == INTERFACE_SPECIFIER.SET ) {
                    this.element_metainf.children[i].putInformation( info.children, block.querySelector( 'div' ) );
                } else {
                    this.element_metainf.children[i].putInformation( info.children[0], block.querySelector( 'div' ) );
                }
                break;
            }            
        }
    }
    
    function get_alt_block( element_metainf, title ) {
        var alt_block = document.createElement( 'div' ),
              select = document.createElement( 'select' );
        $(alt_block).addClass("alt_block");
        
        if ( title ) {
            var ttl = document.createElement( 'h1' );
            ttl.textContent = title;
            alt_block.appendChild( ttl );
        }        
        
        for ( var i = 0; i < element_metainf.children.length; i++ ) {
            var option = document.createElement( 'option' );
            if ( element_metainf.children[i].sort ) {
                if ( element_metainf.children[i].sort.match( TERMINAL.SORT.REGULAR_EXPR ) ) {
                    option.text = element_metainf.children[i].name;
                } else {
                    option.text = element_metainf.children[i].sort.match( TERMINAL.VALUE.REGULAR_EXPR )[0];
                }
            } else {
                option.text = element_metainf.children[i].name;
            }
            option.value = i;
            option.name = element_metainf.children[i].name;
            select.add( option );
        }
        
        alt_block.appendChild( select );
        if ( !element_metainf.children[select.value].sort || element_metainf.children[select.value].sort.match( TERMINAL.SORT.REGULAR_EXPR ) ) {
            alt_block.appendChild( element_metainf.children[select.value].getEditInterface() );
        }
        
        select.onchange = function() {
            if ( alt_block.querySelector( 'div' ) )
                alt_block.querySelector( 'div' ).remove();
            if ( !element_metainf.children[select.value].sort || element_metainf.children[select.value].sort.match( TERMINAL.SORT.REGULAR_EXPR ) ) {
                alt_block.appendChild( element_metainf.children[select.value].getEditInterface() );
            }
        }
        
        return alt_block;
    }
}
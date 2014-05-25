function Complex( root ) {

    if ( root.interface_specifier != INTERFACE_SPECIFIER.COMPLEX ) return;
    
    var root = clone( root );
    
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );
    this.element_metainf = root;
    
    this.complex_block;
    
    this.getEditInterface = function() {
        this.complex_block = get_complex_block( this.element_metainf, this.title );
        
        return this.complex_block;
    };
    
    this.getInformation = function( block ) {  
        var children = block.children, 
              title_shift = ( block.children[0].nodeName == "H2" ? 1 : 0),        
              vertex = new Vertex( this.element_metainf.name, 
                                            this.element_metainf.specifiers,
                                            this.element_metainf.interface_specifier,
                                            this.element_metainf.sort );
         
        for ( var i = 0; i < this.element_metainf.children.length; i++ ) { 
            var info = this.element_metainf.children[i].getInformation( children[i + title_shift] );
            
            if ( !info ) {
                return;
            } else if ( info.length ) {
                for ( var j = 0; j < info.length; j++ ) {
                    vertex.children.push( info[j] );
                }
            } else {
                vertex.children.push( info );
            }
        }
        return vertex;
    }
    
    this.putInformation = function( info, block ) {  
        var children = block.children, 
              title_shift = ( block.children[0].nodeName == "H2" ? 1 : 0),
              k = 0;
              
        for ( var i = 0; i < this.element_metainf.children.length; i++ ) {
            if ( in_array( this.element_metainf.children[i].interface_specifier, [INTERFACE_SPECIFIER.SET] ) ) {
                var elementsOfSet = new Array();
                while ( info.children[i + k] && this.element_metainf.children[i].name == info.children[i + k].name ) {
                    elementsOfSet.push( info.children[i + k] );
                    k++;
                }
                k--;
                this.element_metainf.children[i].putInformation( elementsOfSet, children[i + title_shift] );
            } else {
                this.element_metainf.children[i].putInformation( info.children[i + k], children[i + title_shift] );
            }
        }
    }
    
    function get_complex_block( element_metainf, title ) {
        var complex_block = document.createElement( 'div' );
        $(complex_block).addClass("complex_block");
        
        if ( title ) {
            var ttl = document.createElement( 'h2' );
            ttl.textContent = title;
            complex_block.appendChild( ttl );
        }
        
        if ( !element_metainf ) return complex_block;
        
        for ( var i = 0; i < element_metainf.children.length; i++ ) {
            var element = element_metainf.children[i].getEditInterface();   
            complex_block.appendChild( element );
        }
        
        return complex_block;
    }
}
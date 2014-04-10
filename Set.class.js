function Set( root ) {
    
    if ( root.interface_specifier != INTERFACE_SPECIFIER.SET ) return;
    
    var root = clone( root );
    
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );
    this.element_metainf = root;
    
    this.min_elements;
    this.max_elements;
    
    if ( in_array( SPECIFIER.ONE, this.element_metainf.specifiers ) || in_array( SPECIFIER.COPY, this.element_metainf.specifiers ) ) {
        this.min_elements = 1;
        this.max_elements = 1;
    } else if ( in_array( SPECIFIER.ONEMM, this.element_metainf.specifiers ) || in_array( SPECIFIER.COPYMM, this.element_metainf.specifiers ) ) {
        this.min_elements = 0;
        this.max_elements = 1;
    } else if ( in_array( SPECIFIER.SET, this.element_metainf.specifiers ) ) {
        this.min_elements = 1;
        this.max_elements = 100000;
    } else if ( in_array( SPECIFIER.SETMM, this.element_metainf.specifiers ) ) {
        this.min_elements = 0;
        this.max_elements = 100000;
    }
    
    this.elements_count = 0;
    
    this.set_block;
    this.add_btn;
    this.delete_btn;
    
    this.getEditInterface = function() {
        this.set_block = get_set_block( this.element_metainf, this.title );
        
        this.add_btn = get_add_button( this );      
        this.delete_btn = get_delete_button( this ); 
        
        var control_block = document.createElement( 'div' );
        $(control_block).addClass("control_block");
        control_block.appendChild( this.add_btn );    
        control_block.appendChild( this.delete_btn );    
        this.set_block.appendChild( control_block );
        
        while ( this.elements_count < this.min_elements ) {
            this.add_btn.click();
        }
        
        update_buttons( this );
        
        return this.set_block;
    }
    
    this.getInformation = function( block ) { 
        var list = block.querySelector( 'ul' ),
              set = Array();
              
        this.element_metainf.resetSpecifiers();
        this.element_metainf.updateSpecifier();
        this.element_metainf.updateInterfaceSpecifier();
        
        for ( var i = 0; i < list.children.length; i++ ) {
            
            var info = this.element_metainf.getInformation( list.children[i].querySelector( 'div' ) );
            
            if ( !info ) {
                return;
            }
            set.push( info );
        }
        
        return set;
    }
    
    function get_set_block( element_metainf, title ) {
        var set_block = document.createElement( 'div' ),
              elements = document.createElement( 'ul' );
        $(set_block).addClass("set_block");
        
        if ( title ) {
            var ttl = document.createElement( 'h3' );
            ttl.textContent = title;
            set_block.appendChild( ttl );
            element_metainf.specifiers.push( SPECIFIER.PROXY );
        }
        
        set_block.appendChild( elements );      

        if ( !element_metainf ) return set_block;
        
        element_metainf.resetSpecifiers();
        element_metainf.updateSpecifier();
        element_metainf.updateInterfaceSpecifier();       
        
        return set_block;
    }
    
    function get_add_button( set_class ) { 
        var btn = new Button( "+", function() {
            set_class.elements_count++;
            var element = document.createElement( 'li' );
            element.appendChild( set_class.element_metainf.getEditInterface() );
            set_class.set_block.querySelector( 'ul' ).appendChild( element );
            
            update_buttons( set_class );
        });
        
        return btn;
    }
    
    function get_delete_button( set_class ) { 
        var btn = new Button( "-", function() { 
            set_class.elements_count--;
            set_class.set_block.querySelector( 'ul' ).lastChild.remove();
            
            update_buttons( set_class );
        });
        
        return btn;
    }
    
    function update_buttons( set_class ) {
        set_class.delete_btn.disabled = !( set_class.elements_count > set_class.min_elements );
        set_class.add_btn.disabled = !( set_class.elements_count < set_class.max_elements );
    }
}
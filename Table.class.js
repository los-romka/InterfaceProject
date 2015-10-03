;function Table( root ) {

    if ( root.interface_specifier != INTERFACE_SPECIFIER.TABLE ) return;
    
    var root = clone( root );
    
    this.name = root.name;
    this.title = ( !in_array( SPECIFIER.PROXY, root.specifiers ) ? root.name : null );    
    this.element_metainf;
    this.type;
    
    for ( var i = 0; i < root.children.length; i++ ) {
        if ( in_array( root.children[i].interface_specifier, [INTERFACE_SPECIFIER.ROW, INTERFACE_SPECIFIER.COLUMN] ) ) {
            this.element_metainf = root.children[i];
            this.type = root.children[i].interface_specifier;
            break;
        }
    }
    
    this.traversal = get_first_traversal( this.element_metainf );
    this.leafs = get_leafs( this.traversal );
    
    this.width = get_width( this.element_metainf );
    this.height = get_height( this.element_metainf );
    
    this.element_metainf.level = 0;
    this.element_metainf.width = this.width;
    this.element_metainf.height = this.height;
    
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
    
    this.matrix = get_matrix( this.type, this.width, this.height, this.traversal );      
    
    this.table_block;    
    this.add_btn;
    this.delete_btn;
        
    this.getEditInterface = function(){
        this.table_block = get_table_block( this.element_metainf, this.title, this.matrix );
        
        this.add_btn = get_add_button( this );
        this.delete_btn = get_delete_button( this );        
        
        var control_block = document.createElement( 'div' );
        $(control_block).addClass("control_block");
        control_block.appendChild( this.add_btn );    
        control_block.appendChild( this.delete_btn );    
        this.table_block.appendChild( control_block );
            
        while ( this.elements_count < this.min_elements ) {
            this.add_btn.click();
        }
            
        update_buttons( this );
        
        return this.table_block;
    }
    
    this.getInformation = function( block ) { 
        var list = block.querySelector( 'table' ),
              set = new Vertex( this.name, [], "", null ),             
              size = get_size_from_blocks( this.type, this.height, list );
        
        for ( var i = 0; i < size ; i++ ) {
            var leafs_vals = [];
            
            if ( this.type == INTERFACE_SPECIFIER.ROW ) {
                for ( var j = 0; j < list.children[i + this.height + 1].children.length; j++ ) {
                    leafs_vals.push( list.children[i + this.height + 1].children[j].querySelector( 'div' ) );
                }
            } else {
                for ( var j = this.width - 1; j >= 0 ; j-- ) {
                    leafs_vals.push( list.children[j].children[list.children[j].children.length - size + i].querySelector( 'div' ) );
                }
            }
            
            var info = merge_leafs_val_with_meta( leafs_vals, this.element_metainf );
            
            set.children.push( info );
        } 

        return set;
    }
    
    this.putInformation = function( info, block ) {
        var children = block.children, 
              title_shift = ( block.children[0].nodeName == "H1" ? 1 : 0),
              elementsOfSet = [],
              k = 0,
              list = block.querySelector( 'table' ),
              size = get_size_from_blocks( this.type, this.height, list ),
              leafs_meta = get_leafs( get_first_traversal( clone( this.element_metainf ) ) )
              
              
        while ( info.children[k] && this.element_metainf.name == info.children[k].name ) {
            elementsOfSet.push( info.children[k] );
            k++;
        }
        
        while ( size < elementsOfSet.length ) {
            block.lastChild.children[0].click();
            size++;
        }
        
        for ( var i = 0; i < size ; i++ ) {
            var leafs_blocks = [];
            
            if ( this.type == INTERFACE_SPECIFIER.ROW ) {
                for ( var j = 0; j < list.children[i + this.height + 1].children.length; j++ ) {
                    leafs_blocks.push( list.children[i + this.height + 1].children[j].querySelector( 'div' ) );
                }
            } else {
                for ( var j = this.width - 1; j >= 0 ; j-- ) {
                    leafs_blocks.push( list.children[j].children[list.children[j].children.length - size + i].querySelector( 'div' ) );
                }
            }
            
            put_info_leafs_vals( elementsOfSet[i], leafs_blocks, this.element_metainf );
        }  
    }
    
    function get_size_from_blocks( type, height, table ) {
        var size = 0;
        
        if ( type == INTERFACE_SPECIFIER.ROW ) {
            size = table.children.length - height - 1;
        } else {            
            for ( var j = 0; j < table.children[0].children.length; j++ ) {
                if ( table.children[0].children[j].nodeName != "TH" ) {
                    size++;
                }
            }
        }    
        
        return size;
    }
    
    function put_info_leafs_vals( info, leafs_blocks, element_metainf ) {
        var traversal_meta = [],
              queue_meta = [],
              traversal_info = [],
              queue_info = [];
        
        queue_meta.push( clone(element_metainf) );
        queue_info.push( clone(info) );
        
        while ( queue_meta.length ) {
            
            var current_meta = queue_meta.pop(),
                  current_info = queue_info.pop();

            traversal_meta.push( current_meta );            

            if ( isHeaderVertex( current_meta ) ) {       
                var k = 0;
                for ( var i = 0; i < current_meta.children.length; i++ ) {
                    queue_meta.push( current_meta.children[i] );
                    
                    if ( in_array( current_meta.children[i].interface_specifier, [interface_specifier.set] ) ) {
                        var elementsofset = [];
                        while ( current_info.children[i + k] && current_meta.children[i].name == current_info.children[i + k].name ) {
                            elementsofset.push( current_info.children[i + k] );
                            k++;
                        }
                        k--;
                        queue_info.push( elementsofset );
                    } else {
                        queue_info.push( current_info.children[i+k] );
                    }               
                }
            } else {
                traversal_info.push( current_info );
            }
        }
        
        for ( var i = traversal_meta.length - 1; i >= 0; i-- ) {
            if ( isHeaderVertex( traversal_meta[i] ) ) {
                traversal_meta.splice( i, 1 );
            }  
        }
        
        if ( traversal_meta.length == 0 ) {
            element_metainf.resetSpecifiers();
            element_metainf.updateSpecifier();
            element_metainf.updateInterfaceSpecifier();
            
            traversal_meta.push( element_metainf );
            traversal_info.push( info ); 
        }
        
        for ( var i = 0; i < traversal_meta.length; i++ ) {
            traversal_meta[i].putInformation( traversal_info[i], leafs_blocks.pop() );
        }
    }
    
    function merge_leafs_val_with_meta( leafs_vals, element_metainf ) {
        var vertex = clone( element_metainf ),
              traversal = get_first_traversal( vertex );
        
        if ( traversal.length == 1 ) {
            var value = leafs_vals.shift(),
                  current = traversal.pop();
                  
            current.resetSpecifiers();
            current.updateSpecifier();
            current.updateInterfaceSpecifier();
            
            return current.getInformation( value );
        }
        
        while ( traversal.length ) {
            
            var parent = traversal.pop();
            if ( !isHeaderVertex( parent ) ) continue;
            
            for ( var i = 0; i < parent.children.length; i++ ) {
                var current = parent.children[i];
                if ( !isHeaderVertex( current ) ) {
                    var value = leafs_vals.shift(),
                          info = current.getInformation( value );   
                    
                    if ( info.length >= 0) {
                        parent.children[i] = info;
                    } else {
                        current.sort = info.sort;
                        current.children = info.children;
                    }
                }
            }
        }
        
        return vertex;
    }
    
    function get_table_block( element_metainf, title, matrix ) {
        var table_block = document.createElement( 'div' );
        $(table_block).addClass("table_block");
        
        if ( title ) {
            var ttl = document.createElement( 'h1' );
            ttl.textContent = title;
            table_block.appendChild( ttl );
        }
        
        if ( !element_metainf ) return table_block;
        
        table_block.appendChild( form_table( matrix ) ); 
        
        return table_block;
        
    }
    
    function get_add_button( table_class ) { 
        var btn = new Button( "+", function() {        
            table_class.elements_count++;
            
            if ( table_class.element_metainf.sort ) {
                var td = document.createElement( 'td' ); 
                
                if ( !in_array( SPECIFIER.PROXY, table_class.element_metainf.specifiers ) ) {
                    table_class.element_metainf.specifiers.push( SPECIFIER.PROXY );
                }   
                
                table_class.element_metainf.resetSpecifiers();
                table_class.element_metainf.updateSpecifier();
                table_class.element_metainf.updateInterfaceSpecifier();
                
                td.appendChild( table_class.element_metainf.getEditInterface() );  
                
                if ( table_class.type == INTERFACE_SPECIFIER.ROW ) {
                    var tr = document.createElement( 'tr' );                                          
                    tr.appendChild( td );                         
                    table_class.table_block.querySelector( 'table' ).appendChild( tr );
                } else {                    
                    table_class.table_block.querySelector( 'table>tr' ).appendChild( td );
                }
            } else {
                var tr = document.createElement( 'tr' ); 
                for ( var i =  table_class.leafs.length - 1; i >= 0; i-- ) {
                    var td = document.createElement( 'td' );
                    
                    if ( !in_array( SPECIFIER.PROXY, table_class.leafs[i].specifiers ) ) {
                        table_class.leafs[i].specifiers.push( SPECIFIER.PROXY );
                    }
                    
                    td.appendChild( table_class.leafs[i].getEditInterface() );  
                    
                    if ( table_class.type == INTERFACE_SPECIFIER.ROW ) {
                        tr.appendChild( td );
                    } else {
                        table_class.table_block.querySelector( 'table' ).children[i].appendChild( td );
                    }
                }
                if ( table_class.type == INTERFACE_SPECIFIER.ROW ) {
                    table_class.table_block.querySelector( 'table' ).appendChild( tr );
                }
            }
            
            update_buttons( table_class );
        });
        
        return btn;
    }

    function get_delete_button( table_class ) { 
        var btn = new Button( "-", function() { 
            table_class.elements_count--;
            
            if ( table_class.type == INTERFACE_SPECIFIER.ROW ) {
                table_class.table_block.querySelector( 'table' ).lastChild.remove();
            } else {
                for ( var i = 0; i < table_class.table_block.querySelector( 'table' ).children.length; i++ ) {
                    table_class.table_block.querySelector( 'table' ).children[i].lastChild.remove();
                }
            }
            
            update_buttons( table_class );
        });
        
        return btn;
    }
    
    function update_buttons( table_class ) {
        table_class.delete_btn.disabled = !( table_class.elements_count > table_class.min_elements );
        table_class.add_btn.disabled = !( table_class.elements_count < table_class.max_elements );
    }

    function form_table( matrix ) {
        var table = document.createElement( 'table' );
        
        for ( var i = 0; i < matrix.length; i++ ) {
            var tr = document.createElement( 'tr' ); 
            
            for ( var j = 0; j < matrix[i].length; j++ ) {
                var th = document.createElement( 'th' );
                th.colSpan = matrix[i][j].colSpan;  
                th.rowSpan = matrix[i][j].rowSpan;   
                th.textContent = matrix[i][j].textContent;
                tr.appendChild( th );
            }
            
            table.appendChild( tr );
        }
        
        return table;
    }

    function get_matrix( type, width, height, traversal ) {
        var traversal = clone( traversal );        
        
        return ( ( type == INTERFACE_SPECIFIER.COLUMN ) 
            ? get_vertical_matrix( width, height, traversal ) 
            : get_horizontal_matrix( width, height, traversal ) );            
    }
    
    function get_vertical_matrix( width, height, traversal ) {
        var matrix = [],
              current;        
              
        for ( var i = 0; i < width; i++ ) {
            matrix[i] = [];
        }
        
        var row_height = 0,
              current_row = 0;
              
        if ( in_array( SPECIFIER.PROXY, traversal[0].specifiers ) ) {
            traversal.shift();
            row_height = 1;
        }
        
        while ( current = traversal.shift() ) { 
        
            var height_inc = ( isHeaderVertex( current ) ? 1 : ( height - current.level ) );
                
            if ( row_height >= height ) {
                row_height = current.level;
                current_row++;
            }
            
            matrix[current_row].push({
                rowSpan : current.width,
                colSpan : height_inc,
                textContent : ( ( in_array( SPECIFIER.PROXY, current.specifiers ) ) ? "" : current.name )            
            });
            
            row_height = row_height + height_inc;
        }            
        
        return matrix;
    }

    function get_horizontal_matrix( width, height, traversal ) {
        var matrix = [], 
              current;        
              
        for ( var i = 0; i <= height; i++ ) {
            matrix[i] = [];
        }
        
        if ( in_array( SPECIFIER.PROXY, traversal[0].specifiers ) ) {
            traversal.shift();
        }
        
        while ( current = traversal.pop() ) {
            matrix[current.level].push({
                rowSpan : ( isHeaderVertex( current ) ? 1 : ( height - current.level ) ),
                colSpan : current.width,
                textContent : ( ( in_array( SPECIFIER.PROXY, current.specifiers ) ) ? "" : current.name )
            });
        }        
        
        return matrix;
    }

    function get_leafs( traversal ) {
        var leafs = clone( traversal );
        
        for ( var i = leafs.length - 1; i >= 0; i-- ) {
            if ( isHeaderVertex( leafs[i] ) ) {
                leafs.splice( i, 1 );
            }  
        }
        
        return leafs;
    }
    
    function get_first_traversal( element_metainf ) {
        var traversal = [],
              queue = [];
              
        queue.push( element_metainf );
          
        while ( queue.length ) {
            
            var current = queue.pop();
            
            if ( !in_array( current, traversal ) ) {        
                traversal.push( current );
                if ( isHeaderVertex( current ) ) {       
                    for ( var i = 0; i < current.children.length; i++ ) {
                       queue.push( current.children[i] );
                    }
                }
            }
        }
        
        return traversal;
    }
    
    function get_height( vertex, level ) {        
        var height = 1;
        level = level || 1;   
        
        if ( isHeaderVertex( vertex ) ) {
            
            vertex.children.forEach( function( child ) {   
                child.height = get_height( child, level + 1 );
                child.level = level;
                height =  Math.max( height, child.height + 1 );
            });
        }
        
        return height;
    }
    
    function get_width( vertex ) {
        var width = 0;
        
        if ( ( isHeaderVertex( vertex ) ) 
            && vertex.children.length ) {    
            
            vertex.children.forEach( function( child ) {
                child.width = get_width( child );
                width = width + child.width;
            });
        } else {
            width = 1;
        }
                    
        return width;
    }
    
    function isHeaderVertex( vertex ) {
        return in_array( vertex.interface_specifier, [INTERFACE_SPECIFIER.UNDEFINED, INTERFACE_SPECIFIER.COMPLEX, INTERFACE_SPECIFIER.ROW, INTERFACE_SPECIFIER.COLUMN] );
    }
       
}
;function CollectionVertex( $block, meta ) {
    var data = $block.data('collection');
    if (data) {
        return data;
    }

    /* init object */
    var self = $.extend($block, {
        meta: meta,
        setInfo: setInfo,
        getInfo: getInfo,
        destroy: function() {
            self.html('');
        }
    });

    /* init DOM */
    var _type = in_array(meta.interface_specifier, [INTERFACE_SPECIFIER.HORIZONTAL, INTERFACE_SPECIFIER.VERTICAL ] ) ?  meta.interface_specifier : INTERFACE_SPECIFIER.HORIZONTAL;
    var _traversal = get_first_traversal( self.meta )
    var _leafs = get_leafs( _traversal );

    var _width = get_width( self.meta );
    var _height = get_height( self.meta );

    self.meta.level = 0;
    self.meta.width = _width;
    self.meta.height = _height;

    if ( in_array( SPECIFIER.ONE, self.meta.specifiers ) || in_array( SPECIFIER.COPY, self.meta.specifiers ) ) {
        self.min_elements = 1;
        self.max_elements = 1;
    } else if ( in_array( SPECIFIER.ONEMM, self.meta.specifiers ) || in_array( SPECIFIER.COPYMM, self.meta.specifiers ) ) {
        self.min_elements = 0;
        self.max_elements = 1;
    } else if ( in_array( SPECIFIER.SET, self.meta.specifiers ) ) {
        self.min_elements = 1;
        self.max_elements = 100000;
    } else if ( in_array( SPECIFIER.SETMM, self.meta.specifiers ) ) {
        self.min_elements = 0;
        self.max_elements = 100000;
    }
    /** TODO: add LIST support */

    self.elements_count = 0;

    var matrix = get_matrix( _type, _width, _height, _traversal );

    var form = get_collection_block( self.meta, matrix );

    $( form ).children().appendTo( self );
    self.addClass("collection_block")
        .addClass( _type == INTERFACE_SPECIFIER.HORIZONTAL ? "collection_horizontal" : "collection_vertical" )
        .data('collection', self);

    return self;

    function getInfo() {
        var list = self.find( '>table' ),
            collection = new Vertex( self.meta.name, [], "", null ),
            size = get_size_from_blocks( _type, _height, list ),
            list_children;

        for ( var i = 0; i < size ; i++ ) {
            var leafs_vals = [];

            if ( _type == INTERFACE_SPECIFIER.HORIZONTAL ) {
                list_children = list.find('>tr:nth-child(' + (i + _height + 1) + ')>*');

                for ( var j = 0; j < list_children.length; j++ ) {
                    leafs_vals.push( list_children.eq(j).find('>div') );
                }
            } else {
                for ( var j = _width - 1; j >= 0 ; j-- ) {
                    list_children = list.find('>tr:nth-child(' + ( j + 1 ) + ')>*');
                    leafs_vals.push( list_children.eq(list_children.length - size + i - ( j === 0 ? 1 : 0) ).find( 'div' ) );
                }
            }

            var info = merge_leafs_val_with_meta( leafs_vals, self.meta );

            collection.children.push( info );
        }

        return collection.children;
    }

    function setInfo( info ) {
        var title_shift = ( self.children().eq(0).is('h1') ? 1 : 0 ),
            elementsOfSet = [],
            list = self.find( '>table' ),
            size = get_size_from_blocks( _type, _height, list ),
            leafs_meta = get_leafs( get_first_traversal( clone( self.meta ) )),
            list_children;

        if (info instanceof Vertex) {
            info = [info];
        }

        var k = 0;
        while ( info[k] && self.meta.name == info[k].name ) {
            elementsOfSet.push( info[k] );
            k++;
        }

        while ( size < elementsOfSet.length ) {
            add_element();
            size++;
        }

        var element_meta = clone(self.meta);
        element_meta.simplifyCollection();

        for ( var i = 0; i < size ; i++ ) {
            var leafs_blocks = [];

            if ( _type == INTERFACE_SPECIFIER.HORIZONTAL ) {
                list_children = list.find('>tr:nth-child(' + (i + _height + 1) + ')>*');
                for ( var j = 0; j < list_children.length; j++ ) {
                    leafs_blocks.push( list_children.eq(j).find('>div') );
                }
            } else {
                for ( var j = _width - 1; j >= 0 ; j-- ) {
                    list_children = list.find('>tr:nth-child(' + ( j + 1 ) + ')>*');
                    leafs_blocks.push( list_children.eq(list_children.length - size + i - ( j === 0 ? 1 : 0) ).find( 'div' ) );
                }
            }

            put_info_leafs_vals( elementsOfSet[i], leafs_blocks, element_meta );
        }

        return self;
    }

    function get_collection_block( element_metainf, matrix ) {
        var table_block = document.createElement( 'div' );

        table_block.appendChild( form_table( matrix ) );

        var new_add_btn = document.createElement( 'button' );
        new_add_btn.textContent = '+ Добавить';
        new_add_btn.onclick = add_element;
        $( new_add_btn ).addClass('add');

        /** for HORIZONTAL */
        if (_type == INTERFACE_SPECIFIER.HORIZONTAL) {
            var tr = table_block.querySelector('table>tr:last-child');

            var td = document.createElement( 'td' );
            $( td ).attr( 'colSpan', '100%' );

            tr.appendChild( td );
            td.appendChild( new_add_btn );
        } else {
            var tr = table_block.querySelector('table>tr:first-child');

            var th = document.createElement( 'th' );
            $( th ).attr( 'rowSpan', _height + 1 );

            tr.appendChild( th );
            th.appendChild( new_add_btn );
        }

        while ( self.elements_count < self.min_elements ) {
            add_element();
        }

        update_buttons();

        return table_block;
    }

    function sortArrayByMeta(leafs, leafs_meta) {
        return leafs.sort(function(a, b) {
            var aIndex = leafs_meta.findIndex(function(element) {
                return element.name === a.name;
            });

            var bIndex = leafs_meta.findIndex(function(element) {
                return element.name === b.name;
            });

            return aIndex - bIndex;
        });
    }

    /* TODO: refactor */
    function get_size_from_blocks( type, height, table ) {
        var size = 0;

        if ( type == INTERFACE_SPECIFIER.HORIZONTAL ) {
            size = table.children().length - height - 1;
        } else {
            var table_children = table.find( '>tr:first-child>*' );
            for ( var j = 0; j < table_children.length; j++ ) {
                if ( !table_children.eq(j).is('th') ) {
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

            if (current_info instanceof Vertex) {
                sortArrayByMeta( current_info.children, current_meta.children);
            }

            traversal_meta.push( current_meta );

            if ( isHeaderVertex( current_meta ) ) {
                var k = 0;

                for ( var i = 0; i < current_meta.children.length; i++ ) {
                    queue_meta.push( current_meta.children[i] );

                    if ( in_array( current_meta.children[i].interface_specifier, [INTERFACE_SPECIFIER.SET, INTERFACE_SPECIFIER.LIST] ) ) {
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

        if ( traversal_meta.length === 0 ) {
            traversal_meta.push( element_metainf );
            traversal_info.push( info );
        }

        /** FUCKING MAGIC OR SOME ITERATIONS */
        var magic_meta = clone(traversal_meta);

        for ( var i = 0; i < traversal_meta.length; i++ ) {
            AbstractVertex( $( leafs_blocks.pop() ), magic_meta[i] ).setInfo( traversal_info[i] );
        }
    }

    function merge_leafs_val_with_meta( leafs_vals, element_metainf ) {
        var vertex = clone( element_metainf ),
            traversal = get_first_traversal( vertex );

        if ( traversal.length == 1 ) {
            var value = leafs_vals.shift(),
                current = traversal.pop();

            current.simplifyCollection();

            return AbstractVertex( $( value ), current ).getInfo();
        }

        while ( traversal.length ) {

            var parent = traversal.pop();
            if ( !isHeaderVertex( parent ) ) continue;

            for ( var i = 0; i < parent.children.length; i++ ) {
                var current = parent.children[i];
                if ( !isHeaderVertex( current ) ) {
                    var value = leafs_vals.shift(),
                        info = AbstractVertex( $( value ), current ).getInfo();

                    /* if an error */
                    if (!info) {
                        continue;
                    }

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

    function add_element() {
        self.elements_count++;

        if ( self.meta.sort ) {
            var td = document.createElement( 'td' ),
                block = document.createElement( 'div' );

            if ( !in_array( SPECIFIER.PROXY, _leafs[0].specifiers ) ) {
                _leafs[0].specifiers.push( SPECIFIER.PROXY );
            }

            _leafs[0].simplifyCollection();

            $( td ).append( AbstractVertex( $( block ), _leafs[0] ) );

            if ( _type == INTERFACE_SPECIFIER.HORIZONTAL ) {
                var tr = document.createElement( 'tr' );
                tr.appendChild( td );

                $( tr ).insertBefore( self.find( '>table>tr:last-child' ) );
            } else {
                $( td ).insertBefore( self.find( '>table>tr:first-child>th:last-child' ) );
            }
        } else {
            var tr = document.createElement( 'tr' );
            for ( var i =  _leafs.length - 1; i >= 0; i-- ) {
                var td = document.createElement( 'td' ),
                    block = document.createElement( 'div' );

                if ( !in_array( SPECIFIER.PROXY, _leafs[i].specifiers ) ) {
                    _leafs[i].specifiers.push( SPECIFIER.PROXY );
                }

                $( td ).append( AbstractVertex( $( block ), _leafs[i] ) );

                if ( _type == INTERFACE_SPECIFIER.HORIZONTAL ) {
                    tr.appendChild( td );
                } else {
                    //
                    if ( i == 0 ) {
                        $( td ).insertBefore( self.find( '>table>tr:first-child>th:last-child' ) );
                    } else {
                        self.find( '>table' ).children().eq(i).append( td );
                    }
                }
            }

            if ( _type == INTERFACE_SPECIFIER.HORIZONTAL ) {
                $( tr ).insertBefore( self.find( '>table>tr:last-child' ) );
            }
        }

        update_buttons();

        /** TODO: addbtn callback */
    }

    /* TODO: refactor */
    function get_delete_button( table_class ) {
        var btn = new Button( "-", function() {
            table_class.elements_count--;

            if ( _type == INTERFACE_SPECIFIER.HORIZONTAL ) {
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

    function update_buttons() {
        getAddButton().attr( 'disabled', !( self.elements_count < self.max_elements ) );
    }

    function getAddButton() {
        return self.find( '>table>tr>*>.add' );
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
        traversal = clone( traversal );

        return ( ( type == INTERFACE_SPECIFIER.VERTICAL )
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
        return in_array( vertex.interface_specifier, [INTERFACE_SPECIFIER.UNDEFINED, INTERFACE_SPECIFIER.COMPLEX, INTERFACE_SPECIFIER.HORIZONTAL, INTERFACE_SPECIFIER.VERTICAL] );
    }
}
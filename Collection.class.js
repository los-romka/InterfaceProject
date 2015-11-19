;function CollectionVertex( $block, meta ) {
    var data = $block.data('collection');
    if (data) {
        return data;
    }

    /* init object */
    var self = $.extend($block, {
        meta: meta,
        element_meta: clone( meta ),
        elements: [],
        setInfo: setInfo,
        getInfo: getInfo,
        destroy: function() {
            self.html('');
        }
    });

    var defaultConfig = {
        ORIENTATION: COLLECTION_ORIENTATION.HORIZONTAL
    };

    var config = $.extend(defaultConfig, meta.interface_params);

    /* init DOM */
    var _orientation = in_array(config.ORIENTATION, [COLLECTION_ORIENTATION.HORIZONTAL,COLLECTION_ORIENTATION.VERTICAL]) ?  config.ORIENTATION : COLLECTION_ORIENTATION.HORIZONTAL;
    var _type = intersect( self.meta.specifiers, [ SPECIFIER.SET, SPECIFIER.SETMM ] ).length > 0
        ? COLLECTION_TYPE.SET
        : COLLECTION_TYPE.LIST;

    self.element_meta.simplifyCollection();

    var _traversal = get_first_traversal( self.element_meta );
    var _leafs = get_leafs( _traversal );

    var _width = get_width( self.element_meta );
    var _height = get_height( self.element_meta );

    self.element_meta.level = 0;
    self.element_meta.width = _width;
    self.element_meta.height = _height;


    if ( intersect( self.meta.specifiers, [ SPECIFIER.ONE, SPECIFIER.COPY ] ).length > 0 ) {
        self.min_elements = 1;
        self.max_elements = 1;
    } else if ( intersect( self.meta.specifiers, [ SPECIFIER.ONEMM, SPECIFIER.COPYMM ] ).length > 0 ) {
        self.min_elements = 0;
        self.max_elements = 1;
    } else if ( intersect( self.meta.specifiers, [ SPECIFIER.SET, SPECIFIER.LIST ] ).length > 0 ) {
        self.min_elements = 1;
        self.max_elements = 100000;
    } else if ( intersect( self.meta.specifiers, [ SPECIFIER.SETMM, SPECIFIER.LISTMM ] ).length > 0 ) {
        self.min_elements = 0;
        self.max_elements = 100000;
    }

    self.elements_count = 0;

    var matrix = get_matrix( _orientation, _width, _height, _traversal );

    var form = get_collection_block( matrix );

    $( form ).children().appendTo( self );
    self.addClass("collection_block")
        .addClass( _orientation == COLLECTION_ORIENTATION.HORIZONTAL ? "collection_horizontal" : "collection_vertical" )
        .data('collection', self);

    while ( self.elements_count < self.min_elements ) {
        add_element();
    }

    update_buttons();

    return self;

    function getInfo() {
        var list = self.find( '>table' ),
            collection = new Vertex( self.element_meta.name, [], "", null ),
            size = get_size_from_blocks( _orientation, _height, list );

        for ( var i = 0; i < size ; i++ ) {
            var leafs_blocks = get_leafs_blocks(list, size, i);

            var info = merge_leafs_val_with_meta( leafs_blocks, self.element_meta );

            collection.children.push( info );
        }

        return collection.children;
    }

    function setInfo( info ) {
        var elementsOfSet = [],
            list = self.find( '>table' ),
            size = get_size_from_blocks( _orientation, _height, list );

        if (info instanceof Vertex) {
            info = [info];
        }

        if (info.length > 0) {
            var k = 0;
            while ( info[k] && self.element_meta.name == info[k].name ) {
                elementsOfSet.push( info[k] );
                k++;
            }

            while ( size < elementsOfSet.length ) {
                add_element();
                size++;
            }

            for ( var i = 0; i < size ; i++ ) {
                var leafs_blocks = get_leafs_blocks(list, size, i);

                self.elements[i] = elementsOfSet[i];
                put_info_leafs_vals( elementsOfSet[i], leafs_blocks, self.element_meta );
            }
        }

        return self;
    }

    function get_collection_block( matrix ) {
        var table_block = document.createElement( 'div' );

        table_block.appendChild( form_table( matrix ) );

        var add_btn = generate_add_button();

        /* append HORIZONTAL CONTROL HEADINGS for HORIZONTAL orientation */
        if (_orientation == COLLECTION_ORIENTATION.HORIZONTAL) {
            var _index = in_array( SPECIFIER.PROXY, self.meta.specifiers ) ? 1 : 0;

            if ( _type == COLLECTION_TYPE.SET ) {
                $( document.createElement( 'th' ) )
                    .attr( 'rowSpan', _height - _index )
                    .insertBefore(
                        $( table_block )
                            .find( '>table' )
                            .children()
                            .eq( _index )
                            .find('>*:first-child' )
                    )
                ;
            }

            $( document.createElement( 'th' ) )
                .attr( 'rowSpan', _height - _index )
                .insertAfter(
                    $( table_block )
                        .find( '>table' )
                        .children()
                        .eq( _index )
                        .find('>*:last-child' )
                )
            ;

        /* append VERTICAL CONTROL HEADINGS for VERTICAL orientation */
        } else {
            var tr_name = document.createElement( 'tr' );
            var th_name = document.createElement( 'th' );
            tr_name.appendChild(th_name);

            var tr_control = document.createElement( 'tr' );
            var th_control = document.createElement( 'th' );
            tr_control.appendChild(th_control);

            if ( _type == COLLECTION_TYPE.SET ) {
                $( th_name )
                    .attr( 'colSpan', _height );
                $( tr_name )
                    .insertBefore( $( table_block ).find( '>table>tr:first-child' ) );
            }

            $( th_control )
                .attr( 'colSpan', _height );
            $( tr_control )
                .insertAfter( $( table_block ).find( '>table>tr:last-child' ) );
        }

        /* append ADD button for HORIZONTAL orientation */
        var tr, head_part;

        if (_orientation == COLLECTION_ORIENTATION.HORIZONTAL) {
            tr = table_block.querySelector('table>tr:last-child');
            head_part = document.createElement( 'td' );
            $( head_part ).attr( 'colSpan', '100%' );

            /* append ADD button for VERTICAL orientation */
        } else {
            tr = table_block.querySelector('table>tr:first-child');
            head_part = document.createElement( 'th' );
            $( head_part ).attr( 'rowSpan', _width + 1 + ( _type == COLLECTION_TYPE.SET ? 1 : 0 ) );
        }

        tr.appendChild( head_part );
        head_part.appendChild( add_btn );

        return table_block;
    }

    function get_leafs_blocks(list, size, i) {
        var leafs_blocks = [],
            list_children, j;

        if ( _orientation == COLLECTION_ORIENTATION.HORIZONTAL ) {
            list_children = list.find('>tr:nth-child(' + (i + _height + 1) + ')>*');

            for ( j = _type == COLLECTION_TYPE.SET ? 1 : 0; j < list_children.length - 1; j++ ) {
                leafs_blocks.push( list_children.eq(j).find('>div') );
            }
        } else {
            for ( j = _width + (_type == COLLECTION_TYPE.SET ? 0 : -1); j >= (_type == COLLECTION_TYPE.SET ? 1 : 0); j-- ) {
                list_children = list.find('>tr').eq(j).children();
                leafs_blocks.push( list_children.eq(list_children.length - size + i - ( j === 0 ? 1 : 0) ).find( 'div' ) );
            }
        }

        return leafs_blocks;
    }

    function get_size_from_blocks( type, height, table ) {
        var size = 0;

        if ( type == COLLECTION_ORIENTATION.HORIZONTAL ) {
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

    /** TODO: refactor */
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

                    if ( current_meta.children[i].interface_specifier == INTERFACE_SPECIFIER.COLLECTION ) {
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

        while ( traversal_meta.length > 0 ) {
            current_meta = traversal_meta.shift();
            current_info = traversal_info.shift();

            AbstractVertex( $( leafs_blocks.pop() ), current_meta ).setInfo( current_info );
        }
    }

    function merge_leafs_val_with_meta( leafs_vals, element_metainf ) {
        var vertex = clone( element_metainf ),
            queue = [],
            current, i;

        queue.push( vertex );

        while ( queue.length ) {
            current = queue.pop();

            if ( !isHeaderVertex( current ) ) {
                var info = AbstractVertex( $( leafs_vals.pop() ), current ).getInfo();

                if ( info ) {
                    if ( info.length >= 0 ) {
                        var index = 0,
                            parent = current.parent;

                        while( parent.children[index].name != current.name ) {
                            index++;
                        }

                        if (info.length === 0) {
                            parent.children.splice(index, 1);
                        } else {
                            parent.children[index] = info[0];
                            index++;
                        }


                        for (i = 1; i < info.length; i++) {
                            parent.children.splice(index, 0, info[i]);
                            index++;
                        }
                    } else {
                        current.sort = info.sort;
                        current.children = info.children;
                    }
                }
            } else {
                for ( i = 0; i < current.children.length; i++ ) {
                    current.children[i].parent = current;
                    queue.push( current.children[i] );
                }
            }
        }

        return vertex;
    }
    /** TODO: refactor */
    function add_element() {
        self.elements_count++;
        self.elements.push(clone(self.element_meta));

        if ( self.element_meta.sort ) {
            var td = document.createElement( 'td' ),
                block = document.createElement( 'div' );

            if ( !in_array( SPECIFIER.PROXY, _leafs[0].specifiers ) ) {
                _leafs[0].specifiers.push( SPECIFIER.PROXY );
            }

            $( td ).append( AbstractVertex( $( block ), _leafs[0] ) );

            if ( _orientation == COLLECTION_ORIENTATION.HORIZONTAL ) {
                var tr = document.createElement( 'tr' );
                tr.appendChild( td );

                $( tr ).insertBefore( self.find( '>table>tr:last-child' ) );
                append_horizontal_controls();
            } else {
                append_vertical_controls();

                if ( _type == COLLECTION_TYPE.SET ) {
                    $( td ).insertAfter( self.find( '>table>tr:nth-child(2)>*:last-child' ) );
                } else {
                    $( td ).insertBefore( self.find( '>table>tr:first-child>*:last-child' ) );
                }
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

                if ( _orientation == COLLECTION_ORIENTATION.HORIZONTAL ) {
                    tr.appendChild( td );
                } else {
                    if ( i == 0 ) {
                        if ( _type == COLLECTION_TYPE.SET ) {
                            $( td ).insertAfter( self.find( '>table>tr:nth-child(2)>*:last-child' ) );
                        } else {
                            $( td ).insertBefore( self.find( '>table>tr:first-child>*:last-child' ) );
                        }
                    } else {
                        self.find( '>table' ).children().eq(i + ( _type == COLLECTION_TYPE.SET ? 1 : 0)).append( td );
                    }
                }
            }

            if ( _orientation == COLLECTION_ORIENTATION.HORIZONTAL ) {
                $( tr ).insertBefore( self.find( '>table>tr:last-child' ) );
                append_horizontal_controls();
            } else {
                append_vertical_controls();
            }
        }

        update_buttons();
    }

    function remove_horizontal_element($tr) {
        return function() {
            self.elements_count--;

            var index = [].indexOf.call($tr.parent().children(), $tr[0]) - _height;
            self.elements.splice(index, 1);

            update_buttons();
            $tr.remove();
        }
    }

    function remove_vertical_element() {
        var $td = $( this ).parent();
        var i = -1;

        while ($td.next().length > 0) {
            $td = $td.next();
            i--;
        }

        var rows = self.find('>table>tr');

        for (var j = 0; j < rows.length; j++) {
            rows.eq(j).children().eq(i - ( j === 0 ? 1 : 0)).remove();
        }

        self.elements_count--;
        update_buttons();
    }

    function generate_add_button() {
        var add_btn = document.createElement( 'button' );
        add_btn.textContent = '+ Добавить';
        add_btn.onclick = add_element;
        $( add_btn ).addClass('add');

        return add_btn;
    }

    function create_remove_button() {
        var remove_btn = document.createElement('button');
        remove_btn.textContent = '- Удалить';
        $(remove_btn).addClass('remove');

        return remove_btn;
    }

    function append_horizontal_controls() {
        if ( _orientation == COLLECTION_ORIENTATION.HORIZONTAL ) {
            var remove_btn_block = document.createElement('td');
            var remove_btn = create_remove_button();
            remove_btn_block.appendChild(remove_btn);

            var $tr = self.find('>table>tr:last-child').prev();

            if (_type === COLLECTION_TYPE.SET) {
                $( document.createElement('td') )
                    .insertBefore($tr.find('>*:first-child'));
            }

            remove_btn.onclick = remove_horizontal_element($tr);

            $(remove_btn_block)
                .insertAfter($tr.find('>*:last-child'));
        }
    }

    function append_vertical_controls() {
        if ( _type === COLLECTION_TYPE.SET ) {
            $( document.createElement('td') )
                .insertBefore( self.find( '>table>tr:first-child>*:last-child' ) );
        }

        var remove_btn_block = document.createElement('td');
        var remove_btn = create_remove_button();
        remove_btn_block.appendChild(remove_btn);

        remove_btn.onclick = remove_vertical_element;

        $( remove_btn_block )
            .insertAfter( self.find( '>table>tr:last-child>*:last-child' ) );
    }

    function update_buttons() {
        getAddButton().attr( 'disabled', !( self.elements_count < self.max_elements ) );
        getRemoveButtons().attr( 'disabled', !( self.elements_count > self.min_elements ) );
    }

    function getAddButton() {
        return self.find( '>table>tr>*>.add' );
    }

    function getRemoveButtons() {
        return self.find( '>table>tr>*>.remove' );
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

        return ( ( type == COLLECTION_ORIENTATION.VERTICAL )
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
        var leafs = [];

        /* for simple vertex */
        if (traversal.length === 1) {
            return [traversal[0]];
        }

        /* for complex vertex */
        for ( var i = 0; i < traversal.length; i++ ) {
            if ( !isHeaderVertex( traversal[i] ) ) {
                leafs.push(traversal[i]);
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

        if ( isHeaderVertex( vertex ) && vertex.children.length ) {
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
        return in_array( vertex.interface_specifier, [INTERFACE_SPECIFIER.UNDEFINED, INTERFACE_SPECIFIER.COMPLEX] );
    }
}
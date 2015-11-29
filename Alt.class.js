;function AltVertex( $block, meta ) {
    var data = $block.data('alt');
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
    var label = ( !in_array( SPECIFIER.PROXY, meta.specifiers ) ? meta.name : null );
    var form = get_alt_block( meta, label );

    $( form ).children().appendTo( self );
    self.addClass("alt_block")
        .data('alt', self)
        .data('type', 'alt');

    return self;

    function getInfo() {
        var list = self.find( 'select' );
        var vertex = new Vertex( self.meta.name, self.meta.specifiers, self.meta.interface_specifier, null);
        var meta = self.meta.children[list.val()];
        var info = meta.interface_specifier == INTERFACE_SPECIFIER.TERMINAL_VALUE
            ? meta
            : AbstractVertex( $( self.find( 'div' ) ), meta ).getInfo()
        ;

        vertex.children.push( info );

        return vertex;
    }

    function setInfo( info ) {
        var list = self.find( 'select' );

        if (info instanceof Vertex) {
            sortArrayByMeta( info.children, self.meta.children);
        }

        for ( var i = 0; i < list.length; i++ ) {
            if ( ( info.children[0].name != "" && self.meta.children[i].name == info.children[0].name )
                || ( info.children[0].name == "" && self.meta.children[i].sort == info.children[0].sort )
            ) {

                list[i].selected = true;
                $( list ).trigger( 'change' );

                if ( self.meta.children[i].interface_specifier == INTERFACE_SPECIFIER.COLLECTION ) {
                    AbstractVertex( $( self.find( 'div' ) ), self.meta.children[i] ).setInfo( info.children );
                } else {
                    AbstractVertex( $( self.find( 'div' ) ), self.meta.children[i] ).setInfo( info.children[0] );
                }
                break;
            }
        }

        return self;
    }

    function get_alt_block( element_metainf, title ) {
        var alt_block = document.createElement( 'div' ),
            select = document.createElement( 'select' );

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
            var elem = document.createElement( 'div' );
            AbstractVertex( $( elem ), element_metainf.children[select.value] );

            alt_block.appendChild( elem );
        }

        select.onchange = function() {
            if ( self.find( 'div' ) ) {
                self.find( 'div' ).remove();
            }

            if ( !element_metainf.children[select.value].sort || element_metainf.children[select.value].sort.match( TERMINAL.SORT.REGULAR_EXPR ) ) {
                var elem = document.createElement( 'div' );
                AbstractVertex( $( elem ), element_metainf.children[select.value] );

                self.append( elem );
            }
        };

        return alt_block;
    }
}
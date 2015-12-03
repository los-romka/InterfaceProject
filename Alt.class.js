;function AltVertex( $block, meta ) {
    var data = $block.data('alt');
    if (data) {
        return data;
    }

    /* init object */
    var self = $.extend($block, {
        meta: meta,
        updateIweConcepts: updateIweConcepts,
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

    function updateIweConcepts($iweBlock) {
        self.iwe = $iweBlock;
        var list = self.find( '>select' )[0];

        var child_meta = self.meta.children[list.value];

        if (child_meta.interface_specifier != INTERFACE_SPECIFIER.TERMINAL_VALUE) {
            var $child_block = self.find( '>div' );

            var infos = getIweInfos($iweBlock, child_meta);

            if (child_meta.interface_specifier === INTERFACE_SPECIFIER.COLLECTION) {
                AbstractVertex( $child_block, child_meta )
                    .updateIweConcepts($iweBlock);
            } else if (infos.length === 0) {
                var produce = getIweProduceFunction($iweBlock, $child_block, child_meta);
                produce(function() {});
            } else {
                AbstractVertex( $child_block, child_meta )
                    .updateIweConcepts(infos.eq(0));
            }
        }
    }

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
        var list = self.find( '>select' )[0];

        if (info instanceof Vertex) {
            sortArrayByMeta( info.children, self.meta.children);
        }

        for ( var i = 0; i < list.length; i++ ) {
            var $child_block = self.find( '>div' );
            var child_meta = self.meta.children[i];

            if ( ( info.children[0].name != "" && child_meta.name == info.children[0].name )
                || ( info.children[0].name == "" && child_meta.sort == info.children[0].sort )
            ) {
                list[i].selected = true;

                var selected_meta = child_meta;

                $child_block.remove();

                if ( !selected_meta.sort || selected_meta.sort.match( TERMINAL.SORT.REGULAR_EXPR ) ) {
                    $child_block = $( document.createElement( 'div' ) );
                    self.append( $child_block );
                }

                if ( child_meta.interface_specifier == INTERFACE_SPECIFIER.COLLECTION ) {
                    AbstractVertex( $child_block, child_meta ).setInfo( info.children );
                } else {
                    AbstractVertex( $child_block, child_meta ).setInfo( info.children[0] );
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
            var selected_meta = element_metainf.children[this.value];

            if ( self.find( '>div' ) ) {
                self.find( '>div' ).remove();
            }

            for ( var i = 0; i < element_metainf.children.length; i++ ) {
                var child_meta = element_metainf.children[i];

                if ( child_meta != selected_meta ) {
                    var infos = getIweInfos(self.iwe, child_meta);
                    var delete_child = getIweDeleteFunction(self.iwe, self, child_meta);

                    for ( var j = 0; j < infos.length; j++ ) {
                        delete_child(j, function(res) {});
                    }

                }
            }

            if ( !selected_meta.sort || selected_meta.sort.match( TERMINAL.SORT.REGULAR_EXPR ) ) {
                var $child_block = $( document.createElement( 'div' ) );

                var infos = getIweInfos(self.iwe, selected_meta);

                if (selected_meta.interface_specifier === INTERFACE_SPECIFIER.COLLECTION) {
                    AbstractVertex( $child_block, selected_meta )
                        .updateIweConcepts(self.iwe);
                } else if (infos.length === 0) {
                    var produce = getIweProduceFunction(self.iwe, $child_block, selected_meta);
                    produce(function() {});
                } else {
                    AbstractVertex( $child_block, selected_meta )
                        .updateIweConcepts(infos.eq(0));
                }

                self.append( $child_block );
            }
        };

        return alt_block;
    }
}
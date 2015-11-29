;function ComplexVertex( $block, meta ) {
    var data = $block.data('complex');
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
    var form = get_complex_block( meta, label );

    $( form ).children().appendTo( self );
    self.addClass("complex_block")
        .data('complex', self)
        .data('type', 'complex');

    return self;

    function getInfo() {
        var title_shift = ( self.children()[0].nodeName == "H2" ? 1 : 0),
            vertex = new Vertex( self.meta.name, self.meta.specifiers, self.meta.interface_specifier, self.meta.sort );

        for ( var i = 0; i < self.meta.children.length; i++ ) {
            var info = AbstractVertex( $( self.children().get(i + title_shift) ), self.meta.children[i] ).getInfo();

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

    function setInfo( info ) {
        var title_shift = self.children().eq(0).is('h2') ? 1 : 0,
            k = 0,
            elem;

        if (info instanceof Vertex) {
            sortArrayByMeta( info.children, self.meta.children);
        }


        for ( var i = 0; i < self.meta.children.length; i++ ) {

            if ( self.meta.children[i].interface_specifier == INTERFACE_SPECIFIER.COLLECTION ) {
                var elementsOfSet = [];
                while ( info.children[i + k] && self.meta.children[i].name == info.children[i + k].name ) {
                    elementsOfSet.push( info.children[i + k] );
                    k++;
                }
                k--;

                elem = elementsOfSet;
            } else {
                elem = info.children[i + k];
            }

            AbstractVertex( $( self.children().get(i + title_shift) ), self.meta.children[i] ).setInfo( elem );
        }

        return self;
    }

    function get_complex_block( element_metainf, title ) {
        var complex_block = document.createElement( 'div' );

        if ( title ) {
            var ttl = document.createElement( 'h2' );
            ttl.textContent = title;
            complex_block.appendChild( ttl );
        }

        for ( var i = 0; i < element_metainf.children.length; i++ ) {
            var element = document.createElement( 'div' );

            AbstractVertex( $(element), element_metainf.children[i]);

            complex_block.appendChild( element );
        }

        return complex_block;
    }
}
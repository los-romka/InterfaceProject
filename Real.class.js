;function RealVertex( $block, meta ) {
    var data = $block.data('real');
    if (data) {
        return data;
    }

    /* init DOM */
    var label = ( !in_array( SPECIFIER.PROXY, meta.specifiers ) ? meta.name : null );
    var form = get_real_block( meta, label );
    $block.append( form );

    /* init object */
    var self = $.extend($block, {
        meta: meta,
        setInfo: setInfo,
        getInfo: getInfo,
        destroy: function() {
            self.html('');
        }
    });

    self.data('real', self);

    return self;

    function getInfo() {
        var value = TO.REAL( self.find( 'input' ).val() );

        if ( !value.match( TERMINAL.VALUE.REAL ) ) {
            self.addClass("error");
            return;
        }
        self.removeClass("error");

        return new Vertex( self.meta.name, self.meta.specifiers, self.meta.interface_specifier, value );
    }

    function setInfo( info ) {
        var value = FROM.REAL( info.sort );
        self.find( 'input' ).val( value ? value : "" );

        return self;
    }

    function get_real_block( element_metainf, title ) {
        var real_block = document.createElement( 'div' ),
            label = document.createElement( 'label' ),
            input = document.createElement( 'input' );
        $(real_block).addClass("real_block");

        if ( title ) {
            var ttl = document.createElement( 'span' );
            ttl.textContent = title;
            label.appendChild( ttl );
        }
        label.appendChild( input );

        real_block.appendChild( label );

        return real_block;
    }
}
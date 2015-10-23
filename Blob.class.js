;function BlobVertex( $block, meta ) {
    var data = $block.data('blob');
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
    var form = get_blob_block( meta, label );

    $( form ).children().appendTo( self );
    self.addClass("blob_block")
        .data('blob', self);

    return self;

    function getInfo() {
        var value = TO.BLOB( self.find( 'input' ).val() );

        if ( !value.match( TERMINAL.VALUE.BLOB ) ) {
            self.addClass("error");
            return;
        }
        self.removeClass("error");

        return new Vertex( self.meta.name, self.meta.specifiers, self.meta.interface_specifier, value );
    }

    function setInfo( info ) {
        var value = FROM.BLOB( info.sort );
        self.find( 'input' ).val( value ? value : "" );

        return self;
    }

    function get_blob_block( element_metainf, title ) {
        var blob_block = document.createElement( 'div' ),
            label = document.createElement( 'label' ),
            input = document.createElement( 'input' );

        if ( title ) {
            var ttl = document.createElement( 'span' );
            ttl.textContent = title;
            label.appendChild( ttl );
        }
        label.appendChild( input );

        blob_block.appendChild( label );

        return blob_block;
    }
}
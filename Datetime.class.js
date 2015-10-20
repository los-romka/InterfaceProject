;function DatetimeVertex( $block, meta ) {
    var data = $block.data('datetime');
    if (data) {
        return data;
    }

    /* init DOM */
    var label = ( !in_array( SPECIFIER.PROXY, meta.specifiers ) ? meta.name : null );
    var form = get_datetime_block( meta, label );
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

    self.data('datetime', self);

    return self;

    function getInfo() {
        var value = TO.DATE( self.find( 'input' ).val() );

        if ( !value.match( TERMINAL.VALUE.DATE ) ) {
            self.addClass("error");
            return;
        }
        self.removeClass("error");

        return new Vertex( self.meta.name, self.meta.specifiers, self.meta.interface_specifier, value );
    }

    function setInfo( info ) {
        var value = FROM.DATE( info.sort );
        self.find( 'input' ).val( value ? value : "" );

        return self;
    }

    function get_datetime_block( element_metainf, title ) {
        var datetime_block = document.createElement( 'div' ),
            label = document.createElement( 'label' ),
            input = document.createElement( 'input' );
        $(datetime_block).addClass("datetime_block");
        input.type = "datetime-local";

        if ( title ) {
            var ttl = document.createElement( 'span' );
            ttl.textContent = title;
            label.appendChild( ttl );
        }
        label.appendChild( input );

        datetime_block.appendChild( label );

        return datetime_block;
    }
}
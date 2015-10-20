;function BooleanVertex( $block, meta ) {
    var data = $block.data('boolean');
    if (data) {
        return data;
    }

    /* init DOM */
    var label = ( !in_array( SPECIFIER.PROXY, meta.specifiers ) ? meta.name : null );
    var form = get_boolean_block( meta, label );
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

    self.data('boolean', self);

    return self;

    function getInfo() {
        var value = TO.BOOL( self.find( 'input' ).is(":checked") );

        if ( !value.match( TERMINAL.VALUE.BOOL ) ) {
            self.addClass("error");
            return;
        }
        self.removeClass("error");

        return new Vertex( self.meta.name, self.meta.specifiers, self.meta.interface_specifier, value );
    }

    function setInfo( info ) {
        var value = FROM.BOOL( info.sort ) == 'true';
        self.find( 'input' ).attr('checked', !!value );

        return self;
    }

    function get_boolean_block( element_metainf, title ) {
        var boolean_block = document.createElement( 'div' ),
            label = document.createElement( 'label' ),
            input = document.createElement( 'input' );
        $(boolean_block).addClass("boolean_block");
        input.type = "checkbox";

        label.appendChild( input );

        if ( title ) {
            var ttl = document.createElement( 'span' );
            ttl.textContent = title;
            label.appendChild( ttl );
        }

        boolean_block.appendChild( label );

        return boolean_block;
    }
}
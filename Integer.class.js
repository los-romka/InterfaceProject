;function IntegerVertex( $block, meta ) {
    var data = $block.data('integer');
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
    var form = get_integer_block( meta, label );

    $( form ).children().appendTo( $block );
    self.addClass("integer_block")
        .data('integer', self)
        .data('type', 'integer');

    return self;

    function updateIweConcepts($iweBlock) {
        if (self.meta.isModification()) {
            /* onchange */
            var change = getIweChangeFunction($iweBlock, self, self.meta);

            self.find( 'input' ).unbind( 'change' ).change(function() {
                var value = this.value;

                var regex = /^-?[0-9]+$/;

                if ( !(regex.test(value)) ) {
                    self.addClass("error");
                    return;
                }

                self.removeClass("error");

                change(value, function() {});
            });
        }
    }

    function getInfo() {
        var value = TO.INT( self.find( 'input' ).val() );

        if ( !value.match( TERMINAL.VALUE.INT ) ) {
            self.addClass("error");
            return;
        }
        self.removeClass("error");

        return new Vertex( self.meta.name, self.meta.specifiers, self.meta.interface_specifier, value );
    }

    function setInfo( info ) {
        var value = FROM.INT( info.sort );
        self.find( 'input' ).val( value ? value : "" );

        return self;
    }

    function get_integer_block( element_metainf, title ) {
        var integer_block = document.createElement( 'div' ),
            label = document.createElement( 'label' ),
            input = document.createElement( 'input' );

        input.value = DEFAULT_VALUE[ self.meta.sort ];

        $( input ).attr('readonly', !self.meta.isModification());

        if ( title ) {
            var ttl = document.createElement( 'span' );
            ttl.textContent = title;
            label.appendChild( ttl );
        }
        label.appendChild( input );

        integer_block.appendChild( label );

        return integer_block;
    }
}
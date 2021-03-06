;function StringVertex( $block, meta ) {
    var data = $block.data('string');
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
    var form = get_string_block( meta, label );

    $( form ).children().appendTo( self );
    self.addClass("string_block")
        .data('string', self)
        .data('type', 'string');

    return self;

    function updateIweConcepts($iweBlock) {
        if (self.meta.isModification()) {
            /* onchange */
            var change = getIweChangeFunction($iweBlock, self, self.meta);

            self.find( 'input' ).unbind( 'change' ).change(function() {
                var value = this.value;

                if ( !value ) {
                    self.addClass("error");
                    return;
                }

                self.removeClass("error");

                change(value, function() {});
            });
        }
    }

    function getInfo() {
        var value = TO.STR( self.find( 'input' ).val() );

        if ( !value.match( TERMINAL.VALUE.STR ) ) {
            self.addClass("error");
            return;
        }
        self.removeClass("error");

        return new Vertex( self.meta.name, self.meta.specifiers, self.meta.interface_specifier, value );
    }

    function setInfo( info ) {
        var value = FROM.STR( info.sort );
        self.find( 'input' ).val( value ? value : "" );

        return self;
    }

    function get_string_block( element_metainf, title ) {
        var string_block = document.createElement( 'div' ),
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

        string_block.appendChild( label );

        return string_block;
    }
}
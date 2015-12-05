;function RealVertex( $block, meta ) {
    var data = $block.data('real');
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
    var form = get_real_block( meta, label );

    $( form ).children().appendTo( self );
    self.addClass("real_block")
        .data('real', self)
        .data('type', 'real');

    return self;

    function updateIweConcepts($iweBlock) {
        if (self.meta.isModification()) {
            /* onchange */
            var change = getIweChangeFunction($iweBlock, self, self.meta);

            self.find( 'input' ).unbind( 'change' ).change(function() {
                var value = this.value;

                if ( !(parseInt(value) === value) ) {
                    self.addClass("error");
                    return;
                }

                self.removeClass("error");

                change(value, function() {});
            });
        }
    }

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

        input.value = DEFAULT_VALUE[ self.meta.sort ];

        $( input ).attr('readonly', !self.meta.isModification());

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
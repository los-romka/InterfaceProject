;function DatetimeVertex( $block, meta ) {
    var data = $block.data('datetime');
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
    var form = get_datetime_block( meta, label );

    $( form ).children().appendTo( $block );
    self.addClass("datetime_block")
        .data('datetime', self)
        .data('type', 'datetime');

    return self;

    function updateIweConcepts($iweBlock) {
        /* onchange */
        var change = getIweChangeFunction($iweBlock, self, self.meta);

        self.find( 'input' ).unbind( 'change' ).change(function() {
            var value = this.value;

            if ( !value ) {
                self.addClass("error");
                return;
            }

            self.removeClass("error");

            change(formatValue( value ), function() {});
        });
    }

    function formatValue( value ) {
        var year = value.substring(0, 4),
            month = value.substring(5, 7),
            day = value.substring(8, 10),
            hour = value.substring(11, 13),
            min = value.substring(14, 16),
            sec = "00",
            milisec = "000";

        return day + "." + month + "." + year + "-" + hour + ":" + min + ":" + sec + "." + milisec;
    }

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

        input.type = "datetime-local";
        input.value = DEFAULT_VALUE[ self.meta.sort ];

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
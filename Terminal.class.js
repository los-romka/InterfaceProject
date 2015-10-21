;function TerminalVertex( $block, meta ) {
    var data = $block.data('terminal');
    if (data) {
        return data;
    }

    /* init DOM */
    var label = ( !in_array( SPECIFIER.PROXY, meta.specifiers ) ? meta.name : null );
    var form = get_terminal_block( meta, label );

    /* init object */
    var self = $.extend($block, {
        meta: meta,
        setInfo: setInfo,
        getInfo: getInfo,
        destroy: function() {
            self.html('');
        }
    });

    $( form ).children().appendTo( $block );
    self.addClass("terminal_block")
        .data('terminal', self);

    return self;

    function getInfo() {
        var value = self.meta.sort;

        return new Vertex( self.meta.name, self.meta.specifiers, self.meta.interface_specifier, value );
    }

    function setInfo( info ) {
        var value = info.sort.match( TERMINAL.VALUE.REGULAR_EXPR );
        self.find( 'span' ).text( value ? value[0] : "" );

        return self;
    }

    function get_terminal_block( element_metainf, title ) {
        var terminal_block = document.createElement( 'div' ),
              value_block = document.createElement( 'span' ),
              value = element_metainf.sort.match( TERMINAL.VALUE.REGULAR_EXPR );

        value_block.textContent = ( value ? value[0] : "" );
        
        if ( title ) {
            var ttl = document.createElement( 'label' );
            ttl.textContent = title + " ";
            terminal_block.appendChild( ttl );
        }

        terminal_block.appendChild( value_block );
        
        return terminal_block;
    }
}
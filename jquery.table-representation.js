$.fn.tableRepresentation = function(options) {
    var data = this.data('table-representation');
    if (data) {
        return data;
    }

    var settings = $.extend({
        orientation: 'HORIZONTAL'
    }, options || {});


    var parser = IrParser();
    var meta = parser.toJson( this.data('tpir-meta') );
    var info = parser.toJson( this.data('tpir-info') );

    meta.interface_specifier = INTERFACE_SPECIFIER[ settings.orientation ];

    var self = $( this );

    AbstractVertex( self, meta).setInfo( info );

    self.data('table-representation', self);

    return self;
};
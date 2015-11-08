$.fn.tableRepresentation = function(options) {
    var data = this.data('table-representation');
    if (data) {
        return data;
    }

    var settings = $.extend({
        orientation: 'HORIZONTAL'
    }, options || {});

    var self = $( this );

    var parser = IrParser();
    var meta = parser.toJson( self.data('tpir-meta') );

    meta.transformToCollection( COLLECTION_ORIENTATION[ settings.orientation ] );

    AbstractVertex( self, meta );

    var info;

    if ( info = self.data('tpir-info') ) {
        self.setInfo( parser.toJson( info ) );
    }

    /* INFO DUMP --> */
    var $pre = $('<pre></pre>').insertAfter(self);

    setInterval(function() {
        $pre.text(parser.toIr( self.getInfo() ));
    },5000);
    /* <-- END INFO DUMP */

    console.log('hello world');

    self.data('table-representation', self);

    return self;
};
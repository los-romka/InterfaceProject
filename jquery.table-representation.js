$.fn.tableRepresentation = function(options) {
    var data = this.data('table-representation');
    if (data) {
        return data;
    }

    var _self = $( this );

    /* prepare interface */
    _self.closest('.iwe-concept').find('>div.iwe-concept-details')
    ;//.css('display', 'none');

    /* put table */
    var parser = IrParser();
    var meta = parser.toJson( _self.data('tpir-meta') );

    meta.switchModification( _self.data('is-modification') );
    meta.transformToCollection();

    _self = $.extend(AbstractVertex( _self, meta ), {
        refresh: refresh
    });

    var info;

    if ( info = _self.data('tpir-info') ) {
        _self.setInfo( parser.toJson( info ) );
    }

    initLoading(_self);

    _self.refresh();

    _self.data('table-representation', _self);

    return _self;

    function refresh($concept) {
        $concept = $concept || _self.closest('.iwe-concept');

        unfold($concept, function() {
            _self.updateIweConcepts($concept);
        });
    }

    function unfold($concept, callback) {
        $concept = $concept || _self.closest('.iwe-concept');
        var $unfolded = $concept.find('[title="' + ACTION.SHOW +'"]');

        if ($unfolded.length > 0) {
            var args = retrieveActionsArgs($unfolded);
            doPlatformActions(args, _self, function() {
                unfold($concept, callback);
            });
        } else {
            if (typeof(callback) === "function") {
                callback();
            }
        }
    }
};
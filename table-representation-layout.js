/**
 * Table representation by los-romka
 */
(function( $ ) {
    //#include Project.js
    //#include Common.js
    //#include IrParser.class.js
    //#include Table.class.js
    //#include Set.class.js
    //#include Complex.class.js
    //#include Alt.class.js
    //#include Boolean.class.js
    //#include Datetime.class.js
    //#include String.class.js
    //#include Integer.class.js
    //#include Real.class.js
    //#include Blob.class.js
    //#include TerminalValue.class.js

    $.fn.tableRepresentation = function(options) {
        var data = this.data('table-representation');
        if (data) {
            return data;
        }

        var settings = $.extend({
            orientation: 'HORIZONTAL'
        }, options || {});

        var meta = IrParser().toJson( this.data('tpir-meta') );
        //var meta = IrToJson( tpir );
        // var info = IrToJson( $( input_info_field ).val() );
        
        var interface_block = meta.children[0].getEditInterface();
        this.append( interface_block );
        // if ( info.children[0] ) { 
        //     meta.children[0].putInformation( info.children[0], interface_block );
        // }      

        /**  TODO: refactor */
        var self = $.extend(this, {
        //    refresh: function() {
        //        var new_width = this.width();
        //        var new_height = this.height();
        //        if (width != new_width || height != new_height) {
        //            width = this.width();
        //            height = this.height();
        //            self.position(position);
        //        }
        //    },
        //    position: (function() {
        //        if (settings.orientation == 'vertical') {
        //            return function(n, silent) {
        //                if (n === undefined) {
        //                    return position;
        //                } else {
        //                    position = get_position(n);
        //                    var sw = splitter.width()/2;
        //                    splitter.css('left', position-sw);
        //                    panel_1.width(position-sw);
        //                    panel_2.width(self.width()-position-sw);
        //                }
        //                if (!silent) {
        //                    self.find('.splitter_panel').trigger('splitter.resize');
        //                }
        //                return self;
        //            };
        //        } else if (settings.orientation == 'horizontal') {
        //            return function(n, silent) {
        //                if (n === undefined) {
        //                    return position;
        //                } else {
        //                    position = get_position(n);
        //                    var sw = splitter.height()/2;
        //                    splitter.css('top', position-sw);
        //                    panel_1.height(position-sw);
        //                    panel_2.height(self.height()-position-sw);
        //                }
        //                if (!silent) {
        //                    self.find('.splitter_panel').trigger('splitter.resize');
        //                }
        //                return self;
        //            };
        //        } else {
        //            return $.noop;
        //        }
        //    })(),
            orientation: settings.orientation
        //    destroy: function() {
        //        self.removeClass('splitter_panel');
        //        splitter.unbind('mouseenter');
        //        splitter.unbind('mouseleave');
        //        if (settings.orientation == 'vertical') {
        //            panel_1.removeClass('left_panel');
        //            panel_2.removeClass('right_panel');
        //        } else if (settings.orientation == 'horizontal') {
        //            panel_1.removeClass('top_panel');
        //            panel_2.removeClass('bottom_panel');
        //        }
        //        self.unbind('splitter.resize');
        //        self.find('.splitter_panel').trigger('splitter.resize');
        //        splitters[id] = null;
        //        splitter.remove();
        //        var not_null = false;
        //        for (var i=splitters.length; i--;) {
        //            if (splitters[i] !== null) {
        //                not_null = true;
        //                break;
        //            }
        //        }
        //        //remove document events when no splitters
        //        if (!not_null) {
        //            $(document.documentElement).unbind('.splitter');
        //            $(window).unbind('resize.splitter');
        //            splitters = [];
        //        }
        //    }
        });
        //self.bind('splitter.resize', function(e) {
        //    var pos = self.position();
        //    if (self.orientation == 'vertical' &&
        //        pos > self.width()) {
        //        pos = self.width() - self.limit-1;
        //    } else if (self.orientation == 'horizontal' &&
        //        pos > self.height()) {
        //        pos = self.height() - self.limit-1;
        //    }
        //    if (pos < self.limit) {
        //        pos = self.limit + 1;
        //    }
        //    self.position(pos, true);
        //});
        ////inital position of splitter
        //var pos;
        //if (settings.orientation == 'vertical') {
        //    if (pos > width-settings.limit) {
        //        pos = width-settings.limit;
        //    } else {
        //        pos = get_position(settings.position);
        //    }
        //} else if (settings.orientation == 'horizontal') {
        //    //position = height/2;
        //    if (pos > height-settings.limit) {
        //        pos = height-settings.limit;
        //    } else {
        //        pos = get_position(settings.position);
        //    }
        //}
        //if (pos < settings.limit) {
        //    pos = settings.limit;
        //}
        //self.position(pos, true);
        //if (splitters.length == 0) { // first time bind events to document
        //    $(window).bind('resize.splitter', function() {
        //        $.each(splitters, function(i, splitter) {
        //            splitter.refresh();
        //        });
        //    });
        //    $(document.documentElement).bind('mousedown.splitter', function(e) {
        //        if (splitter_id !== null) {
        //            current_splitter = splitters[splitter_id];
        //            $('<div class="splitterMask"></div>').insertAfter(current_splitter);
        //            if (current_splitter.orientation == 'horizontal') {
        //                $('body').css('cursor', 'row-resize');
        //            } else if (current_splitter.orientation == 'vertical') {
        //                $('body').css('cursor', 'col-resize');
        //            }
        //            settings.onDragStart(e);
        //            return false;
        //        }
        //    }).bind('mouseup.splitter', function(e) {
        //        $('.splitterMask').remove();
        //        current_splitter = null;
        //        $('body').css('cursor', 'auto');
        //        settings.onDragEnd(e);
        //    }).bind('mousemove.splitter', function(e) {
        //        if (current_splitter !== null) {
        //            var limit = current_splitter.limit;
        //            var offset = current_splitter.offset();
        //            if (current_splitter.orientation == 'vertical') {
        //                var x = e.pageX - offset.left;
        //                if(x <= current_splitter.limit) {
        //                    x = current_splitter.limit + 1;
        //                }
        //                else if (x >= current_splitter.width() - limit) {
        //                    x = current_splitter.width() - limit - 1;
        //                }
        //                if (x > current_splitter.limit &&
        //                    x < current_splitter.width()-limit) {
        //                    current_splitter.position(x, true);
        //                    current_splitter.find('.splitter_panel').trigger('splitter.resize');
        //                    return false;
        //                }
        //            } else if (current_splitter.orientation == 'horizontal') {
        //                var y = e.pageY-offset.top;
        //                if(y <= current_splitter.limit) {
        //                    y = current_splitter.limit + 1;
        //                }
        //                else if (y >= current_splitter.height() - limit) {
        //                    y = current_splitter.height() - limit - 1;
        //                }
        //                if (y > current_splitter.limit &&
        //                    y < current_splitter.height()-limit) {
        //                    current_splitter.position(y, true);
        //                    current_splitter.trigger('splitter.resize');
        //                    return false;
        //                }
        //            }
        //            settings.onDrag(e);
        //        }
        //    });
        //}
        //splitters.push(self);

        self.data('table-representation', self);

        return self;
    };
})( jQuery );
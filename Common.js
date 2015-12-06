;function in_array( value, array ) {
    for ( var i = 0; i < array.length; i++ ) {
        if ( array[i] == value ) return true;
    }

    return false;
}

function intersect(a, b) {
    a.sort(); b.sort();
    var ai = 0, bi = 0;
    var result = [];

    while( ai < a.length && bi < b.length ) {
        if (a[ai] < b[bi] ) {
            ai++;
        } else if (a[ai] > b[bi] ) {
            bi++;
        } else {
            result.push(a[ai]);
            ai++;
            bi++;
        }
    }

    return result;
}

function sortArrayByMeta(leafs, leafs_meta) {
    var swapped;
    do {
        swapped = false;
        for (var i=0; i < leafs.length-1; i++) {
            if ( compare(leafs[i], leafs[i+1]) ) {
                var temp = leafs[i];
                leafs[i] = leafs[i+1];
                leafs[i+1] = temp;
                swapped = true;
            }
        }
    } while (swapped);

    return leafs;

    function compare(a, b) {
        var aIndex = leafs_meta.findIndex(function(element) {
            return element.name === a.name;
        });

        var bIndex = leafs_meta.findIndex(function(element) {
            return element.name === b.name;
        });

        return aIndex > bIndex;
    }
}

function clone( obj ) {
    if ( obj == null || typeof( obj ) != 'object' || obj instanceof $)
        return obj;

    var temp = new obj.constructor();
    for ( var key in obj ) {
        if ( obj.hasOwnProperty( key ) ) {
            temp[key] = clone( obj[key] );
        }
    }

    return temp;
}

function toUrlParams(data) {
    var result = [];
    for ( var key in data ) {
        if ( data.hasOwnProperty( key ) ) {
            result.push(key + '=' + data[key]);
        }
    }
    return result.join('&');
}

function retrieveActionsArgs($objs) {
    var arr = [];

    $objs.map(function(index, element) {
        var params = retrieveActionParams($(element));

        arr.push([element, toUrlParams(params)]);
    });

    return arr;
}

function retrieveActionParams($element) {
    var data = {};

    var paramsRaw = $element.attr('onclick')
            .match(new RegExp("'(.+)'"))[1]
            .split('&')
            .filter(function(elem) {
                return elem && !!elem.length;
            })
        ;

    $.map(paramsRaw, function(elem) {
        var arg = elem.split('=');
        data[ arg[0] ] = arg[1];
    });

    return data;
}

function initLoading($block) {
    $block.append($('<div class="overlay"></div>').hide());
    $block.append($('<div class="modal">Загрузка...</div>').hide());
}

function startLoading($block) {
    $block.find('.overlay').height( $block.height() - 10 );
    $block.find('.overlay, .modal').show();
}

function finishLoading($block) {
    $block.find('.overlay, .modal').hide();
}

var platform_action_in_process = null;
var platform_action_queue = [];

function executeNextFromQueue() {
    var args = platform_action_queue.shift();

    if (args) {
        doPlatformActions(args[0], args[1], args[2]);
    }
}

function doPlatformActions(args, $tableRepresentationNode, callback, last_data, iterationFlag) {
    if (platform_action_in_process && !iterationFlag) {
        platform_action_queue.push([args, $tableRepresentationNode, callback]);
        return;
    }

    platform_action_in_process = true;

    var current;

    $tableRepresentationNode = $tableRepresentationNode.closest('.table-representation');

    if( current = args.shift() ) {
        var a = current[0], clickParams = current[1];

        startLoading($tableRepresentationNode);

        var win = $(a).closest('div.iacpaas-window');

        if (win.length == 0) {
            win = $tableRepresentationNode.closest('div.iacpaas-window');
        }

        $.ajax({
            type: "GET",
            url: mw.util.wikiScript(),
            data:	{
                action: 'ajax',
                rs: 'wfUiOnClickFunction',
                rsargs: [win.attr('id'), '$current-tab=' + win.attr('current-tab') + '&' + clickParams]
            },
            dataType: 'html',
            success: function(result) {
                doPlatformActions(args, $tableRepresentationNode, callback, result, true);
            }
        });
    } else {
        if ( typeof(callback) === "function" ) {
            callback( last_data );
        }

        if ( last_data ) {
            var code = $tableRepresentationNode.data('node-code');

            var new_html = $( last_data )
                .find('[data-node-code="' + code + '"]')
                .closest('.iwe-concept')
                .find('>.iwe-concept-details')
                .html();

            last_data = null;

            $tableRepresentationNode
                .closest('.iwe-concept')
                .find('>.iwe-concept-details')
                .html(new_html);

            $tableRepresentationNode
                .data('table-representation')
                .refresh();
        }

        finishLoading($tableRepresentationNode);

        platform_action_in_process = false;
        executeNextFromQueue();
    }
}

function updateTableRepresentationInfo($node, last_data) {
    var $tableRepresentationNode = $node.closest('.table-representation');
    var code = $tableRepresentationNode.data('node-code');

    var $newTable = $( last_data )
        .find('[data-node-code="' + code + '"]');

    var parser = IrParser();

    var info;

    if ( info = $newTable.data('tpir-info') ) {
        $tableRepresentationNode
            .data('table-representation')
            .setInfo( parser.toJson( info ) )
            .refresh();
    }
}

function getParentIweBlock($iweBlock) {
    return $iweBlock.parent().closest('.iwe-concept');
}

function getIweInfos($iweBlock, vertex, fromParent) {
    var info_html_name = " [" + vertex.toHtmlName() + "]";

    if (fromParent) {
        $iweBlock = getParentIweBlock($iweBlock);
    }

    if (vertex.sort) {
        return $iweBlock
            .find(
            '>.iwe-concept-details' +
            '>.iwe-concept-children' +
            '>div:contains(' + info_html_name + ')')
            .contents()
            .filter(function() { return this.nodeType == 3 && this.textContent == info_html_name; })
            .closest('div');
    }

    return $iweBlock
        .find(
        '>.iwe-concept-details' +
        '>.iwe-concept-children' +
        '>div' +
        '>.iwe-editor' +
        '>div' +
        '>.iwe-concept' +
        '>.iwe-concept-header' +
        '>div:first-child:contains(' + info_html_name + ')')
        .contents()
        .filter(function() { return this.nodeType == 3 && this.textContent == info_html_name; })
        .closest('div.iwe-concept');
}

function getIweProduceFunction($iweBlock, $block, vertex, fromParent) {
    if (fromParent) {
        $iweBlock = getParentIweBlock($iweBlock);
    }

    var $produceBtn = $iweBlock
        .find(
        '>.iwe-concept-details' +
        '>.iwe-concept-generations' +
        '>div' +
        '>:contains(' + vertex.toHtmlName() + ')');

    if ($produceBtn.length === 0) {
        return function(callback) {console.log('empty for' + vertex.name )
            callback();
        }
    }

    var params = retrieveActionParams($produceBtn);

    var produceUrlParams = {
        conceptId: params.conceptId,
        metaRelationId: params.metaRelationId,
        metaConceptId: params.metaConceptId
    };

    if ( intersect(vertex.specifiers, [SPECIFIER.COPY, SPECIFIER.COPYMM]).length > 0 ) {
        produceUrlParams.action = ACTION.GENERATE;
    } else if ( vertex.sort ) {
        produceUrlParams.action = ACTION.CREATE;
        produceUrlParams.concept_value = DEFAULT_VALUE[ vertex.sort ];
        produceUrlParams.required_field = "value";
    } else {
        produceUrlParams.action = ACTION.CREATE;
        produceUrlParams.concept_name = vertex.name;
    }

    return function(callback) {
        doPlatformActions([[$produceBtn[0], toUrlParams(produceUrlParams)]], $block, callback);
    }
}

function getIweChangeFunction($iweBlock, $block, vertex) {
    var $editBtn = $iweBlock.find(
        (vertex.sort ? '' : '>.iwe-concept-header>div')
        + '>[title="' + ACTION.EDIT_TITLE + '"]'
    );

    if ($editBtn.length === 0) {
        return function(value, callback) {
            callback();
        }
    }

    var params = retrieveActionParams($editBtn);

    var updateUrlParams = {
        required_field: params.required_field,
        conceptId: params.conceptId,
        relationId: params.relationId,
        action: ACTION.UPDATE
    };

    return function(value, callback) {
        var changeParams = $.extend({
            concept_value: value
        }, updateUrlParams);

        doPlatformActions([[$editBtn[0], toUrlParams(changeParams)]], $block, callback);
    }
}

function getIweDeleteFunction($iweBlock, $block, vertex) {
    var infos = getIweInfos($iweBlock, vertex);

    return function(index, callback) {
        var $deleteBtn = infos.eq(index).find(
            (vertex.sort ? '' : '>.iwe-concept-header>div')
            + '>[title="' + ACTION.DELETE_TITLE + '"]'
        );

        if ($deleteBtn.length === 0) {
            return function(value, callback) {
                callback();
            }
        }

        var params = retrieveActionParams($deleteBtn);

        var deleteUrlParams = {
            conceptId: params.conceptId,
            relationForDelete: params.relationForDelete,
            action: ACTION.DELETE
        };

        doPlatformActions([[$deleteBtn[0], toUrlParams(deleteUrlParams)]], $block, callback);
    };
}
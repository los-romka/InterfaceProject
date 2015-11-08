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
    return leafs.sort(function(a, b) {
        var aIndex = leafs_meta.findIndex(function(element) {
            return element.name === a.name;
        });

        var bIndex = leafs_meta.findIndex(function(element) {
            return element.name === b.name;
        });

        return aIndex - bIndex;
    });
}

function clone( obj ) {
    if ( obj == null || typeof( obj ) != 'object' )
        return obj;
    var temp = new obj.constructor();
    for ( var key in obj ) {
        if ( obj.hasOwnProperty( key ) ) {
            temp[key] = clone( obj[key] );
        }
    }

    return temp;
}
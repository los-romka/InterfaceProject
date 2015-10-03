;function in_array( value, array ) {
    for ( var i = 0; i < array.length; i++ ) {
        if ( array[i] == value ) return true;
    }

    return false;
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
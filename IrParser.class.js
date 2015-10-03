;function IrParser() {

    return {
        toJson: function IrToJson( text ) {
            var current_pos = 0,
                tree = new Vertex( "tree", [SPECIFIER.COPY,SPECIFIER.PROXY], INTERFACE_SPECIFIER.COMPLEX, null ),
                stack = [tree],
                current_vertex;

            while ( current_pos < text.length && stack.length > 0 ) {
                var full_name = get_full_name( text, current_pos );

                current_pos = current_pos + full_name.length + 1;

                current_vertex = stack.pop();

                if ( !full_name.trim().length ) continue;

                var _specifiers = full_name.match( SPECIFIER.REGULAR_EXPR ),
                    _interface_specifier = full_name.match( INTERFACE_SPECIFIER.REGULAR_EXPR ),
                    _sort = full_name.match( TERMINAL.REGULAR_EXPR ),

                    specifiers = ( ( _specifiers ) ? _specifiers : Array() ),
                    interface_specifier = ( ( _interface_specifier ) ? _interface_specifier[0] : INTERFACE_SPECIFIER.UNDEFINED ),
                    sort = ( ( _sort ) ? _sort[0] : null );

                var name = full_name.replace( SPECIFIER.REGULAR_EXPR, "" )
                    .replace( INTERFACE_SPECIFIER.REGULAR_EXPR, "" )
                    .replace( TERMINAL.REGULAR_EXPR, "" )
                    .trim();

                var toPushVertex = new Vertex( name, specifiers, interface_specifier, sort );
                toPushVertex.updateSpecifier().updateInterfaceSpecifier();

                current_vertex.children.push( toPushVertex );
                stack.push( current_vertex );

                if ( text[current_pos-1] == "{" ) {
                    stack.push( current_vertex.children[current_vertex.children.length-1] );
                }
            }

            return tree;
        },

        toIr: function ( json ) {
            return putVertex( json, 0 );
        }
    };

    function putVertex( vertex, level ) {
        var text = "";

        if ( vertex.length >= 0 ) {
            for ( var i = 0; i < vertex.length; i++ ) {
                text = text + putVertex( vertex[i], level );
            }
            return text;
        }

        for ( var i = 0; i < level*2; i++ ) {
            text = text + " ";
        }

        text = text + vertex.name;

        if ( !vertex.sort ) {
            text = text + " {\n";
            for ( var i = 0; i < vertex.children.length; i++ ) {
                text = text + putVertex( vertex.children[i], level + 1 );
            }
            for ( var i = 0; i < level*2; i++ ) {
                text = text + " ";
            }
            text = text + "}\n";
        } else {
            text = text + vertex.sort + "\n";;
        }

        return text;
    }

    function get_full_name( text, current_pos ) {
        var line, lines = [];

        /* Костыль для ссылок */
        line = text.substring( current_pos ).match( /^[\s\S]*?;/ );
        if ( line ) {lines.push( line[0] );}

        line = text.substring( current_pos ).match( /^[\s\S]*?[\s\S](?={)/ );
        if ( line ) lines.push( line[0] );

        line = text.substring( current_pos ).match( /^[\s\S]*?]/ );
        if ( line ) lines.push( line[0] );

        line = text.substring( current_pos ).match( /^[\s]*(?=})/ );
        if ( line ) lines.push( line[0] );

        line = "";

        for ( var i = 0; i < lines.length; i++ ) {
            if ( !line.length ) {
                line = lines[i];
            }
            if ( lines[i].length < line.length ){
                line = lines[i];
            }
        }

        return line;
    }
}
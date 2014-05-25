<html>
<head>
    <link rel="stylesheet" href="stylesheet.css">
    <script src="jquery.js"></script>  
    <script src="file.js"></script>  
    <script src="Project.js"></script>  
    <script src="Table.class.js"></script>  
    <script src="Set.class.js"></script>  
    <script src="Complex.class.js"></script>  
    <script src="Alt.class.js"></script>
    <script src="Boolean.class.js"></script>
    <script src="Datetime.class.js"></script>
    <script src="String.class.js"></script>
    <script src="Integer.class.js"></script>
    <script src="Real.class.js"></script>
    <script src="Blob.class.js"></script>
    <script src="TerminalValue.class.js"></script>
    <script>     
        $( document ).ready( function() { 
            var meta, info, field_css = { "width" : "450px", "height" : "300px", "resize" : "none" },
                  input_field = document.createElement( 'textarea' ),
                  input_info_field = document.createElement( 'textarea' ); 
            
            $( input_field ).css( field_css );
            $( "#main>span" )[0].appendChild( input_field );     
            $( input_info_field ).css( field_css );
            $( "#main>span" )[0].appendChild( input_info_field );
                
            f_get( 'info.ir', function( text ) {
                $( input_info_field ).val( text );
            }); 
            
            f_get( 'meta.ir', function( text ) {
                $( input_field ).val( text );
            });
            
            var output_field = document.createElement( 'textarea' ); 
            $( output_field ).val( "" );
            $( output_field ).css( field_css );
            $( "#main>span" )[2].appendChild( output_field );
                        
            var btn_generate = new Button( "Сгенерировать", function() { 
                $( "#interface" ).html("");
                meta = IrToJson( $( input_field ).val() );
                info = IrToJson( $( input_info_field ).val() );
                
                var interface_block = meta.children[0].getEditInterface();
                $( "#interface" ).append( interface_block );
                if ( info.children[0] ) { 
                    meta.children[0].putInformation( info.children[0], interface_block );
                }                
            });
            
            var btn_get = new Button( "Получить информацию", function() { 
                $( output_field ).val( JsonToIr( meta.children[0].getInformation( $( "#interface>div" )[0] ) ) );     
                $.ajax({
                    type: "POST",
                    url: "save.php",
                    data: { info: $( output_field ).val(), filename: 'info.ir' },
                    success: function() {
                        $.ajax({
                            type: "POST",
                            url: "save.php",
                            data: { info: $( input_field ).val(), filename: 'meta.ir' }
                        });
                    }
                });
            });
            
            $( "#main>span" )[1].appendChild( btn_generate );  
            $( "#main>span" )[1].appendChild( btn_get );
        });
    </script>
</head>

<body>
    <div id="main"><span></span><span></span><span></span></div>
    <div id="interface"></div>
</body>
</html>
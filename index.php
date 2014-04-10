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
        f_get( 'test.ir', function( text ) {
            var meta, field_css = { "width" : "450px", "height" : "300px", "resize" : "none" };
            
            var input_field = document.createElement( 'textarea' ); 
            $( input_field ).val( text );
            $( input_field ).css( field_css );
            $( "#main>span" )[0].appendChild( input_field );
            
            var output_field = document.createElement( 'textarea' ); 
            $( output_field ).val( "" );
            $( output_field ).css( field_css );
            $( "#main>span" )[2].appendChild( output_field );
                        
            var btn_generate = new Button( "Сгенерировать", function() { 
                $( "#interface" ).html("");
                meta = IrToJson( $( input_field ).val() );
                
                $( "#interface" ).append( meta.children[0].getEditInterface() );  
            });
            
            var btn_get = new Button( "Получить информацию", function() { 
                $( output_field ).val( JsonToIr( meta.children[0].getInformation( $( "#interface>div" )[0] ) ) );              
            });
            
            $( "#main>span" )[1].appendChild( btn_generate );  
            $( "#main>span" )[1].appendChild( btn_get );
                     
        });        
    </script>
</head>

<body>
    <div id="main"><span></span><span></span><span></span></div>
    <div id="interface"></div>
    <!--<h1>Пример картинки</h1>
    <img src="sivcev.jpg" alt="">!-->
</body>
</html>
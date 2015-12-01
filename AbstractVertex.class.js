;function AbstractVertex( $block, meta ) {
    meta.updateInterfaceSpecifier();

    var _class;

    switch ( meta.interface_specifier ) {
        case INTERFACE_SPECIFIER.COLLECTION :     _class = CollectionVertex; break;

        case INTERFACE_SPECIFIER.ALT :            _class = AltVertex; break;
        case INTERFACE_SPECIFIER.COMPLEX :        _class = ComplexVertex; break;
        case INTERFACE_SPECIFIER.BOOLEAN :        _class = BooleanVertex; break;
        case INTERFACE_SPECIFIER.DATETIME :       _class = DatetimeVertex; break;
        case INTERFACE_SPECIFIER.STRING :         _class = StringVertex; break;
        case INTERFACE_SPECIFIER.INTEGER :        _class = IntegerVertex; break;
        case INTERFACE_SPECIFIER.REAL :           _class = RealVertex; break;
        case INTERFACE_SPECIFIER.BLOB :           _class = BlobVertex; break;
        case INTERFACE_SPECIFIER.TERMINAL_VALUE : _class = TerminalVertex; break;
        default :                                 _class = function() {return null;}
    }

    return _class( $block, meta );
}
var FormValidator = function (obj) {

    //private properties
    var _obj = obj,
        _self = this,
        _fields = _obj.find( '[required]:not(select)' ),
        _textInputs = _obj.find( 'input[type!=checkbox], textarea' ),
        _checkboxInputs = _obj.find( 'input[type=checkbox][required]' ),
        _citySelect = _obj.find( '.city-selector[data-required]' ),
        _select = _obj.find( 'select[required]' ),
        _multipleSelect = _obj.find( '.custom-multiple-select[data-required]' ),
        _multipleSelectOptions = _multipleSelect.find( 'input[type=checkbox]' ),
        _site = $( '#site' );

    //private methods
    var _construct = function () {
            _onEvents();
            _obj[ 0 ].obj = _self;
        },
        _addNotTouchedClass = function () {
            _fields.each( function() {

                var curItem = $(this);

                if( curItem.val() === '' ){
                    curItem.addClass( 'is-not-touched' );
                }

                if ( curItem.hasClass( 'is-valid' ) ){
                    curItem.removeClass( 'is-not-touched' );
                }

            } );
            _checkboxInputs.each( function() {

                var curItem = $(this);

                if ( !curItem.is( ':checked' ) ){
                    curItem.addClass( 'is-not-touched' )
                }

            } );
            _citySelect.each( function() {

                var curItem = $(this),
                    citySelectOptions = curItem.find( 'option' );

                if ( citySelectOptions.filter( ':selected' ).val() == 0 ){
                    $( this ).addClass( 'is-not-touched' )
                }

            } );
            _select.each( function() {

                var curItem = $(this),
                    selectOptions = curItem.find( 'option' );

                if ( selectOptions.filter( ':selected' ).val() == 0 ){
                    curItem.parents( '.select' ).addClass( 'is-not-touched' )
                }

            } );
            _multipleSelect.each( function() {

                var curItem = $(this),
                    multipleSelectOptions = curItem.find( 'input[type=checkbox]' );

                if ( multipleSelectOptions.filter( ':checked' ).length <= 0 ){
                    curItem.parents( '.multiple-select' ).addClass( 'is-not-touched' )
                }

            } );
        },
        _onEvents = function () {

            _site.on( 'click', function ( e ) {
                if ( $( e.target ).closest( _obj ).length === 0 ){
                    _checkFillingForm();
                }
            } );

            _fields.on( {
                'focus': function() {
                    $( this ).removeClass( 'is-not-touched' );
                },
                'focusout': function() {
                    _validateField( $( this ) );
                },
                'keyup': function () {

                    var curItem = $(this);

                    if ( curItem.hasClass( 'is-not-valid' ) ){
                        _validateField( curItem );
                    }

                }
            } );

            _textInputs.on( 'focusout', function() {
                _checkFillingForm();
            } );

            _multipleSelect.parents( '.multiple-select' ).on( {
                'click': function() {
                    $( this ).parents( '.multiple-select' ).removeClass( 'is-not-touched' );
                }
            } );

            _multipleSelectOptions.on( 'change', function() {
                if ( _multipleSelectOptions.filter( ':checked' ).length > 0 ){
                    _multipleSelect.parents( '.multiple-select' ).removeClass( 'is-not-touched' )
                }
            } );

            _citySelect.on( 'click', function() {
                $( this ).removeClass( 'is-not-touched' );
            } );

            _citySelect.find( 'select' ).on( 'change', function() {
                if ( $( this ).find( 'option' ).filter( ':selected' ).val() == 0 ){
                    $( this ).parents( '.city-selector' ).removeClass( 'is-not-touched' )
                }
            } );

            _select.parents( '.select' ).on( {
                'click': function() {
                    $( this ).removeClass( 'is-not-touched' );
                }
            } );

            _select.on( 'change', function() {
                if ( $( this ).find( 'option' ).filter( ':selected' ).val() == 0 ){
                    _select.parents( '.select' ).removeClass( 'is-not-touched' )
                }
            } );

            _obj.on( 'submit', function() {

                _addNotTouchedClass();

                if( _fields.hasClass( 'is-not-touched' ) ||
                    _fields.hasClass( 'is-not-valid' ) ||
                    _citySelect.hasClass( 'is-not-valid' ) ||
                    _select.parents( '.select' ).hasClass( 'is-not-valid' ) ||
                    _multipleSelect.parents( '.multiple-select' ).hasClass( 'is-not-touched' ) ) {

                    _self.valid = false;

                    return false;
                }

                _controlCheck();

                return false;

            } );

            _checkboxInputs.on( 'click', function() {

                var curItem = $(this);

                if ( curItem.is( ':checked' ) ){
                    curItem.addClass( 'is-valid' ).removeClass( 'is-not-touched' );
                } else {
                    curItem.removeClass( 'is-valid' );
                }

            } );

        },
        _checkFillingForm = function () {

            var letterCounter = 0;

            _textInputs.each( function () {

                var curItem = $(this);

                if ( curItem.val().length > 0 ){
                    letterCounter = letterCounter + 1
                }

            } );

            if ( letterCounter === 0 ) {
                _textInputs.removeClass( 'is-not-touched' );
                _textInputs.removeClass( 'is-not-valid' );
                _citySelect.removeClass( 'is-not-touched' );
                _select.parents( '.select' ).removeClass( 'is-not-touched' );
                _multipleSelect.parents( '.multiple-select' ).removeClass( 'is-not-touched' );
            }

        },
        _makeNotValid = function ( field ) {
            field.addClass( 'is-not-valid' );
            field.removeClass( 'is-valid' );
            _self.valid = false;
        },
        _makeValid = function ( field ) {
            field.removeClass( 'is-not-valid' );
            field.addClass( 'is-valid' );
            _controlCheck();
        },
        _validateEmail = function ( email ) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        _validateField = function ( field ) {

            var type = field.attr( 'type' ),
                tagName = field[0].tagName;

            if( type === 'email' || type === 'text' ){
                if( field.val() === '' ){
                    _makeNotValid( field );
                    return false;
                }
            }

            if( type === 'email' ){
                if( !_validateEmail( field.val() ) ){
                    _makeNotValid( field );
                    return false;
                }
            }

            if( tagName.toLocaleLowerCase() === 'textarea' ){
                if( field.val() === '' ){
                    _makeNotValid( field );
                    return false;
                }
            }

            _makeValid( field );

        },
        _controlCheck = function () {

            if( _fields.filter( '.is-valid' ).length === _fields.length &&
                !_multipleSelect.parents( '.multiple-select' ).hasClass( 'is-not-touched' ) &&
                !_select.parents( '.select' ).hasClass( 'is-not-touched' ) &&
                !_citySelect.hasClass( 'is-not-touched' ) ) {
                _fields.removeClass( 'is-valid' );
                _self.valid = true;
            }

        };

    //public properties
    _self.valid = false;

    _construct();
};
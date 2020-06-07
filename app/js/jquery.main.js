( function(){

    $( function () {

        "use strict";

        new Preload();

        new ElementsSizeOnDesktop();

        new FixSiteHeader();

        new Menu();

        $.each( $( '.js-video' ), function() {
            new SetSizeIframe ( $( this ) );
        } );

        $.each( $( '.anchor' ), function() {
            new Anchor ( $( this ) );
        } );

        $.each( $( '#social' ), function() {
            new InitSocialShare ( $( this ) );
        } );

    } );

    var Anchor = function ( obj ) {

        var _obj = obj,
            _body = $( 'html, body' );

        var _onEvents = function() {

                _obj.on( {
                    click: function() {

                        var curBtn = $( this ),
                            curMargin = curBtn.data( 'margin' );

                        _body.animate( {
                            scrollTop: $( curBtn.attr( 'href' ) ).offset().top - curMargin
                        }, 600);

                        return false;
                    }
                } );

            },
            _construct = function() {
                _onEvents();
            };

        _construct()
    };

    var ElementsSizeOnDesktop = function(){

        //private properties
        var _html = $( 'html' ),
            _buttons = $( 'button' ),
            _window = $( window );

        //private methods
        var _construct = function(){
                _onEvent();
                _proportionalElements();
            },
            _onEvent = function () {

                _window.on( 'resize', function () {
                    _proportionalElements();
                } );

            },
            _proportionalElements = function () {
                if ( _window.outerWidth() >= 992 ) {

                    var koef = _window.outerWidth() * 100 / 1440;

                    _html.css( 'font-size',  koef + 'px' );
                    _buttons.css( 'font-size', koef + 'px' );

                } else {
                    _html.removeAttr( 'style' );
                    _buttons.removeAttr( 'style' );
                }

            };

        //public properties

        //public methods

        _construct();

    };

    var FixSiteHeader = function(){

        //private properties
        var _obj = $( '#site__header' ),
            _window = $( window );

        //private methods
        var _construct = function(){
                _onEvent();
                _checkPosition();
            },
            _onEvent = function () {

                _window.on( 'scroll', function () {
                    _checkPosition();
                } );

            },
            _checkPosition = function () {

                ( _window.scrollTop() > 10 ) ? _fixHeader() : _unfixHeader()

            },
            _fixHeader = function () {
                _obj.addClass( 'is-fixed' )
            },
            _unfixHeader = function () {
                _obj.removeClass( 'is-fixed' )
            };

        //public properties

        //public methods

        _construct();

    };

    var InitSocialShare = function ( obj ) {

        //private properties
        var socialWrap = obj,
            socialItem = socialWrap.find( '.social__item' ),
            socialData = socialWrap.data( 'social' );

        //private methods
        var _initScroll = function () {

                socialItem.ShareLink( {
                    title: socialData[ 'title' ],
                    text: socialData[ 'text' ],
                    image: socialData[ 'image' ],
                    url: socialData[ 'url' ],
                    class_prefix: 's_',
                    width: 640,
                    height: 480
                } );

            },
            _construct = function() {
                _initScroll();
            };

        //public properties

        //public methods

        _construct();

    };

    var Menu = function( ) {

        //private properties
        var _obj = $( '#menu' ),
            _mobileBtn = $( '#hamburger' ),
            _html = $( 'html' ),
            _body = $( 'body' ),
            _site = _body.find( '#site' ),
            _siteHeader = _site.find( '#site__header' ),
            _window = $( window ),
            _position = 0;

        //private methods
        var _onEvent = function() {

                _site.on( 'click', function ( e ) {
                    if ( $( e.target ).closest( _obj ).length === 0 && $( e.target ).closest( _mobileBtn ).length === 0 && _obj.hasClass( 'is-show' ) ){
                        _hideMenu();
                    }
                } );

                _mobileBtn.on( 'click', function () {

                    if ( $( this ).hasClass( 'is-active' ) ){
                        _hideMenu();
                    } else {
                        _showMenu();
                    }

                } );

            },
            _hideMenu = function () {

                _mobileBtn.removeClass( 'is-active' );
                _siteHeader.removeClass( 'is-active' );

                _obj.removeClass( 'is-show' );

                if ( _window.outerWidth() < 992 ){

                    _html.css( 'overflow-y', 'visible' );
                    _body.removeAttr( 'style' );
                    _site.removeAttr( 'style' );

                    _window.scrollTop( _position );

                }

            },
            _showMenu = function () {

                _mobileBtn.addClass( 'is-active' );
                _siteHeader.addClass( 'is-active' );

                _obj.addClass( 'is-show' );

                if ( _window.outerWidth() < 992 ){

                    _position = _window.scrollTop();

                    _html.css( 'overflow-y', 'hidden' );
                    _body.css( 'overflow-y', 'hidden' );

                    _site.css( {
                        'position': 'relative',
                        'top': _position * -1
                    } );

                }

            },
            _construct = function() {
                _onEvent();
            };

        //public properties

        //public methods

        _construct();
    };

    var Preload = function () {

        //private properties
        var _preload = $( '#preload' );

        //private methods
        function _showSite() {

            _preload.addClass( 'preload_loaded' );

            _preload.on( 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {
                _preload.remove();
            } );

        };

        //public properties

        //public methods

        document.addEventListener( 'DOMContentLoaded', _showSite() );

    };

    var SetSizeIframe = function (obj) {

        //private properties
        var _obj = obj,
            _window = $( window );

        //private methods
        var _onEvent = function() {

                _window.on( 'resize', function () {
                    _setSize();
                } );

            },
            _setSize = function () {

                var videoWidth = _obj.outerWidth();

                _obj.css( 'height', videoWidth / 1.7777 + 'px' );

            },
            _construct = function() {
                _onEvent();
                _setSize();
            };

        //public properties

        //public methods

        _construct();

    };

} )();
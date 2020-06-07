$( function() {

    $( '#popup' ).each(function(){
        new Popup($(this));
    } );

} );

var Popup = function( obj ) {
    //private properties
    var _self = this,
        _btnShow =  $( '.popup__open' ),
        _obj = obj,
        _popupWrap = _obj.find( '#popup__wrap' ),
        _popupContents = _obj.find( '.popup__content' ),
        _btnClose = _obj.find( '.popup__close' ),
        _textFrame,
        _scrollContainer = $( 'html' ),
        _body = $( 'body' ),
        _site = _body.find( '#site' ),
        _siteHeader = _site.find( '#site__header-layout' ),
        _url = _body.data( 'action' ),
        // _url = 'php/news-single.json',
        _position = 0,
        _timerClosePopup,
        _window = $( window ),
        _request = new XMLHttpRequest();

    //private methods
    var _getScrollWidth = function (){
            var scrollDiv = document.createElement( 'div' ),
                scrollBarWidth;

            scrollDiv.className = 'popup__scrollbar-measure';

            document.body.appendChild( scrollDiv );

            scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

            document.body.removeChild(scrollDiv);

            return scrollBarWidth;

        },
        _hidePopup = function(){

            _obj.addClass( 'is-hide' ).removeClass( 'is-opened' );

            clearTimeout( _timerClosePopup );

            _obj.on( 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function() {

                _scrollContainer.css( {
                    overflowY: 'auto',
                    paddingRight: 0
                } );
                _body.removeAttr( 'style' );
                _site.removeAttr( 'style' );
                _siteHeader.removeAttr( 'style' );
                _obj.removeAttr( 'style' );

                _window.scrollTop( _position );
                _position = 0;

                _obj.removeClass( 'is-hide' );

                if ( _textFrame != null ) {
                    _request.abort();
                    _textFrame.empty();
                    _textFrame = null;
                }

                _obj.addClass( 'is-loading' );

                _obj.off( 'webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend' );

            } );

        },
        _onEvents = function(){

            _obj.on( 'click', function ( e ) {

                if ( $( e.target ).closest( _popupContents ).length === 0 ){
                    _hidePopup();
                }

            } );

            _btnShow.on( 'click', function() {

                var curBtn = $( this );

                _showPopup( curBtn );
                return false;
            } );

            _btnClose.on( 'click', function(){
                _hidePopup();
                return false;
            } );

        },
        _showPopup = function( btn ){

            _setPopupContent( btn );

            if ( _window.scrollTop() !== 0 ){
                _position = _window.scrollTop();
            }
            _siteHeader.css( {
                'position': 'relative',
                right: _getScrollWidth() / 2
            } );

            _scrollContainer.css( {
                overflowY: 'hidden',
                paddingRight: _getScrollWidth()
            } );

            _body.css( 'overflow-y', 'hidden' );

            _site.css( {
                'position': 'relative',
                'top': _position * -1
            } );

            if ( _popupWrap.outerHeight() <= _window.outerHeight() ) {
                _obj.css( {
                    paddingRight: _getScrollWidth()
                } );
            }

            _obj.addClass( 'is-opened' );

        },
        _setPopupContent = function( btn ){

            var curBtn = btn,
                className = curBtn.data( 'popup' ),
                curContent = _popupContents.filter( '.popup_' + className );

            _popupContents.css( { display: 'none' } );
            curContent.css( { display: 'block' } );

            if ( className === 'news' ) { _setAJAXRequest( curBtn.data( 'id' ) ) }
            if ( className === 'thanks' ) { _commonPopupSet() }

        },
        _commonPopupSet = function () {

            _obj.removeClass( 'is-loading' );

            _timerClosePopup = setTimeout( function () {
                _hidePopup();
                clearTimeout( _timerClosePopup );
            }, 5000 );

        },
        _setAJAXRequest = function ( id ) {

            _request = $.ajax( {
                url: _url,
                data: {
                    action: 'get_single_news',
                    loadPostId: id
                },
                dataType: 'JSON',
                timeout: 20000,
                type: 'POST',
                success: function ( data ) {
                    _setTextPopup( data );
                },
                error: function ( XMLHttpRequest ) {
                    if ( XMLHttpRequest.statusText != "abort" ) {
                        console.error( 'err' );
                    }
                }
            } );

        },
        _setTextPopup = function ( data ) {

            var title = data.title,
                text = data.content;

            _textFrame = obj.find( '#popup__news-content' );

            _textFrame.append( '<div id="popup__news-head">'+ title +'</div>' );
            _textFrame.append( '<div id="popup__news-text">'+ text +'</div>' );

            _obj.removeClass( 'is-loading' );

        },
        _construct = function(){

            _onEvents();
            _obj[ 0 ].obj = _self;

        };

    //public properties

    //public methods
    _self.openPopup = function ( obj ) {
        _showPopup( obj );
    };
    _self.closePopup = function () {
        _hidePopup();
    };
    _self.addNewBtn = function ( obj ) {
        obj.off( 'click' );
        obj.on( 'click', function() {
            var curBtn = $( this );
            _showPopup( curBtn );
            return false;
        } );
    };

    _construct();

};
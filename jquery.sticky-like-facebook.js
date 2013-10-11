// Sticky like Facebook Plugin v0.0.1 for jQuery
// =============
// Author: Paul Weber
// Forked From: Sticky.js by Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 03.09.2013
// Date: 2/12/2012
// Website: http://labs.anthonygarand.com/sticky
// Description: Makes a sidebar smaller than the main content always stay on the screen -
// like facebook does it!

(function ($) {
    var defaults = {
            topSpacing:0,
            bottomSpacing:0,
            className:'is-sticky',
            wrapperClassName:'sticky-wrapper',
            center:false,
            getWidthFrom:'',
            debug: true
        },
        $window = $(window),
        $document = $(document),
        sticked = [],
        windowHeight = $window.height(),
        stickyElementPlacer = function() {
            var scrollTop = $window.scrollTop();

            // position wrapper
            s.stickyWrapper.css('height', ($document.height() - s.topSpacing - s.bottomSpacing - 100) + 'px');
            s.stickyElement.css('width', s.originalWidth);

            var wrapperTop = s.stickyWrapper.offset().top,
                wrapperHeight = s.stickyWrapper.height(),
                scrolling = (s.lastScrollTop < scrollTop) ? 'down' : 'up';

            var attributes = {'position':'relative'};
            var headerHeight = 90;
            var bottomLineOfHeader = scrollTop + headerHeight;

            s.lastScroll = null;

            if (scrolling == 'up') {

                if(s.stickyElement.css('position') === 'fixed' && s.stickyElement.offset().top > s.topSpacing && s.lastScroll == "up") {
                    attributes = {
                        'position':'fixed',
                        'top':"110px", bottom : 'auto'
                    }
                } else {

                    // check if we are over upper border
                    if (bottomLineOfHeader < s.stickyElement.offset().top) {
                        if (bottomLineOfHeader > s.topSpacing) {
                            var newTop = (bottomLineOfHeader - s.topSpacing );

                            // check if we are going over lower border
                            if (newTop + s.stickyElement.height() < s.stickyWrapper.height()) {
                                attributes = {
                                    'position':'fixed',
                                    'top':"110px", bottom : 'auto'
                                }
                            }

                        } else {
                            attributes = $.extend(attributes, {
                                'top':0 + 'px',
                                'bottom':'auto'
                            });
                        }
                    } else {
                        // keep current position as relative
                        attributes = $.extend(attributes, {
                            'top': s.stickyElement.offset().top - s.stickyWrapper.offset().top,
                            'bottom':'auto'
                        });
                    }
                }

            } else if (scrolling == 'down') {



                // check if we are going over lower border
                // leave unchanged until it goes over bottom of screen.
                var lowerElementBorder = s.stickyElement.offset().top + s.stickyElement.height();
                var overLowerBorder = lowerElementBorder < wrapperHeight + wrapperTop;

                if (lowerElementBorder < scrollPositionBottom && overLowerBorder) {

                    //console.log('distanceToBottom',  $document.height() - scrollPositionBottom);
                    if($document.height() - scrollPositionBottom > s.bottomSpacing) {
                        attributes = {
                            'position' : 'fixed',
                            'top' : 'auto',
                            'bottom' : '10px'
                        }
                    } else {
                        // calculate new top from distance from browser window border
                        var absolutePosition = scrollPositionBottom - 10;

                        var relativePosition = absolutePosition - s.stickyElement.height() - s.stickyWrapper.offset().top;

                        attributes = $.extend(attributes, {
                            'top':relativePosition,
                            'bottom':'auto'
                        });
                    }
                } else {
                    // keep current position as relative
                    attributes = $.extend(attributes, {
                        'top': s.stickyElement.offset().top - s.stickyWrapper.offset().top,
                        'bottom':'auto'
                    });
                }

            }

            s.lastScroll = scrolling;
            s.stickyElement.css(attributes);

            s.lastScrollTop = scrollTop;
        },
        scroller = function () {


            for (var i = 0; i < sticked.length; i++) {
                var s = sticked[i];
                this.stickyElementPlacer(s);
            }
        },
        resizer = function () {
            windowHeight = $window.height();
        },
        methods = {
            stick:{

            },
            unstick:{

            },
            init:function (options) {
                var o = $.extend(defaults, options);
                return this.each(function () {
                    var stickyElement = $(this);

                    var stickyId = stickyElement.attr('id');
                    var wrapper = $('<div></div>')
                        .attr('id', stickyId + '-sticky-wrapper')
                        .addClass(o.wrapperClassName);
                    stickyElement.wrapAll(wrapper);

                    if (o.center) {
                        stickyElement.parent().css({width:stickyElement.outerWidth(), marginLeft:"auto", marginRight:"auto"});
                    }

                    if (stickyElement.css("float") == "right") {
                        stickyElement.css({"float":"none"}).parent().css({"float":"right"});
                    }

                    var stickyWrapper = stickyElement.parent();

                    stickyWrapper.css({
                        position:"absolute",
                        top:o.topSpacing,
                        height:$document.height(),
                        left:stickyElement.position().left,
                        right:$document.width() - (stickyElement.offset().left + stickyElement.width())
                    });

                    sticked.push({
                        topSpacing:o.topSpacing,
                        bottomSpacing:o.bottomSpacing,
                        stickyElement:stickyElement,
                        currentTop:null,
                        stickyWrapper:stickyWrapper,
                        className:o.className,
                        getWidthFrom:o.getWidthFrom,
                        originalWidth: stickyElement.width()
                    });
                });
            },
            update:scroller
        };

    // should be more efficient than using $window.scroll(scroller) and $window.resize(resizer):
    if (window.addEventListener) {
        window.addEventListener('scroll', scroller, false);
        window.addEventListener('resize', resizer, false);
    } else if (window.attachEvent) {
        window.attachEvent('onscroll', scroller);
        window.attachEvent('onresize', resizer);
    }

    $.fn.stickyLikeFacebook = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.stickyLikeFacebook');
        }
    };
    $(function () {
        setTimeout(scroller, 0);
    });
})(jQuery);
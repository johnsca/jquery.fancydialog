// jquery.fancydialog.js

(function($) {
    var dialogs = {};

    var _err = function() {
        if (window.console) {
            if (console.error) {
                console.error.apply(console, arguments);
            } else if (console.log) {
                console.log.apply(console, arguments);
            }
        }
    }

    var _is_parent = function() {
        return window == window.parent;
    }

    _handle_options = function(options, element) {
        var options = $.extend({}, $.fancydialog.defaults, options);

        options['type'] = 'iframe';

        if (!('id' in options) && element) {
            options['id'] = element.attr('id');
        }

        var userOnStart = options['onStart'] || function() {};
        var userOnCleanup = options['onCleanup'] || function() {};

        options['onStart'] = function(elemArray, elemIndex, options) {
            $.fancydialog.currentOptions = options;
            $.fancydialog.currentOptions['closedProgramatically'] = false;
            userOnStart.apply(this, arguments);
        }

        options['onCleanup'] = function(elemArray, elemIndex, options) {
            if (!$.fancydialog.currentOptions['closedProgramatically']) {
                if ($.fancydialog.currentOptions['onDialogCancel']) {
                    $.fancydialog.currentOptions['onDialogCancel']();
                }
            }
            $.fancydialog.currentOptions = {};
            userOnCleanup.apply(this, arguments);
        }

        return options;
    }

    $.fancydialog = function(url, options) {
        var options = _handle_options(options);
        options['href'] = url;
        $.fancybox(options);
    }

    $.fn.fancydialog = function(options) {
        var options = _handle_options(options);
        this.fancybox(options);
    }

    $.fancydialog.complete = function(response) {
        if (_is_parent()) {
            _err('Cannot call $.fancydialog.complete from parent window');
            return;
        }
        var $ = parent.jQuery;
        $.fancydialog.currentOptions['closedProgramatically'] = true;
        if ($.fancydialog.currentOptions['onDialogComplete']) {
            $.fancydialog.currentOptions['onDialogComplete'](response);
        }
        $.fancybox.close();
    }

    $.fancydialog.cancel = function() {
        var $ = parent.jQuery;
        $.fancydialog.currentOptions['closedProgramatically'] = true;
        if ($.fancydialog.currentOptions['onDialogCancel']) {
            $.fancydialog.currentOptions['onDialogCancel']();
        }
        $.fancybox.cancel();
        $.fancybox.close();
    }

    $.fancydialog.send = function(data) {
        var frameDoc = $('#fancybox-frame').contents();
        var frameWin = frameDoc.attr('defaultView') || frameDoc.attr('parentWindow');
        frameWin.$(frameDoc).trigger('dialogSignal', data);
    }

    $.fancydialog.defaults = {
        type: 'iframe',
        overlayShow: true,
        hideOnOverlayClick: false,
        hideOnContentClick: false,
        padding: 0,
        titleShow: false,
        onDialogComplete: null,
        onDialogCancel: null
    };

    $.fancydialog.currentOptions = {};
})(jQuery);

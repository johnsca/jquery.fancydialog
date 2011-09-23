# jquery.fancydialog.js
> Version 0.1

# Overview

jquery.fancydialog.js is a wrapper around [jquery.fancybox.js](http://fancybox.net/)
that provides an interface for using iframes as modal dialogs, with mechanisms for
two-way communication.

Using iframes allows for complex, multi-step dialog logic, while the mechanisms
for two-way communication make it easy to pass information and state back and
forth between the calling page and the dialog.

# Basic Example

The following will show a dialog displaying `dialog.html` and will alert
the result:

    $.fancydialog('dialog.html', {
        onDialogComplete: function(response) { alert('Dialog returned: '+response); },
        onDialogCancel: function() { alert('Dialog was cancelled'); }
    });

# Showing Dialogs

Like fancybox, you can apply a fancydialog to elements via a selector:

    $('a.modal').fancydialog(options);

In this usage, the `href` attribute of the element will determine the source
of the initial dialog page.

You can also manually trigger a fancydialog:

    $.fancydialog(dialog_url, options);

In this case, the `dialog_url` parameter controls the initial dialog page.

The options are the same as for fancybox with the following exceptions:

* `type` is always set to `iframe`
* `overlayShow` defaults to `true`
* `hideOnOverlayClick` defaults to `false`
* `hideOnContentClick` defaults to `false`
* `padding` defaults to `0`
* `titleShow` defaults to `false`

Additionally, there are three new options:

* `onDialogComplete`
* `onDialogCancel`

When the dialog completes and returns a value (see below), the
`onDialogComplete` is called, with the dialog's response data passed into
it.  The response data can be any data or object that the dialog wished to
return.

If the user cancels the dialog by closing it via the fancybox close UI, or
if the dialog programatically cancels itself (see below), then the
`onDialogCancel` callback.

# Implementing Dialogs

When a fancydialog's workflow is complete, it will need to return a value
to the calling page.  This is done with the following API:

    $.fancydialog.complete(response);

The value for `response` can be any object or value.  Calling this will close
the dialog on the calling window and fire the `onDialogComplete` callback
with the given return value.

If the user closes the dialog via the fancybox close button UI, or if the
dialog wants to programatically cancels itself (such as to handle a cancel
button embedded within the dialog's HTML), it can do so by calling:

    $.fancydialog.cancel();

Again, this will close the dialog in the parent window and will fire
the `onDialogCancel` callback.

This can also be called by the parent window, which will cancel the currently
active dialog.

# Communicating from the parent to the dialog

The parent can send a signal to a dialog via:

    $.fancydialog.send(data);

The dialog can listen for the custom event `dialogSignal` which will be
triggered when the parent sends to the dialog.  The value of `data` will
be used as the value for `extraParameters` when calling
[trigger](http://api.jquery.com/trigger/), and thus will be passed into
the signal handler.

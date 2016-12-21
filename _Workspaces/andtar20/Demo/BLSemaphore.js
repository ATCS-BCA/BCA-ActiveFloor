// BLSemaphore.js
//
// requires: jQuery v1.7.2
//
// This script notifies BLAppSwitcher (BLAST) when the web app is loaded enough
// so that it's (browser) window can be styled. Run `sendSemaphore` to notify
// BLAST.

// From StackOverflow (http://stackoverflow.com/a/901144). There didn't seem to
// be many easier methods with jQuery. I did look at http://benalman.com/code/projects/jquery-bbq/examples/deparam/,
// but I didn't want to add another dependency.
function getParameterByName(name, url) {
    'use strict';
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * If there are the correct key/value pairs in the query, then a semaphore is
 * sent to BLAST.
 * @param success - The callback for a successful semaphore request.
 * @param failure - The callback for an unsuccessful semaphore request.
 * @returns {boolean} Whether or not sendSemaphore attempted to send a semaphore
 *  request. If the required key/value pair(s) were in the query string, then
 *  this will be true, otherwise it will be false.
 */
function sendSemaphore(success, failure) {
    'use strict';
    
    // Let caller know whether the semaphore was sent or not.
    var sentSemaphore = false;
    
    // If we get the semaphore through the query string notify BLAST.
    var url = getParameterByName("semaphoreurl");
    var guid = getParameterByName("semaphoreguid");
    if (url != null) {
        // We are going to send the semaphore, so we should let the caller know.
        sentSemaphore = true;
        
        if (guid != null) {
            url += "?semaphore=" + guid;
        }
        
        // Make request with callbacks.
        $.get(url)
        .done(success)
        .fail(failure);
    }
    
    return sentSemaphore;
}

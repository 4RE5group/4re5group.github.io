/*
    4re5 group 2026, all rights reserved.
*/

var header_url = "/header.html";
var footer_url = "/footer.html";

// register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.warn('ServiceWorker registration failed: ', err);
        });
    });
}

// function to extract input value from data
function get_import_input(key, data) {
    var regex = new RegExp(key + '="([^"]*)"', 'g');
    var match = regex.exec(data);
    return match ? match[1] : "";
}

// returns the float value of a version name
function get_version(v)
{
    return (Number(v.replaceAll("beta", "").replaceAll(" ", "").replace(".", "#").replaceAll(".", "").replaceAll("#", ".")));
}


async function get_file(url, callback)
{
    if (typeof caches === "undefined")
    {
        console.warn("Caching not enabled");
        const response = await fetch(url).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        });
        callback(response);
        return;
    }
    caches.match(url)
        .then(response => {
            if (response) {
                response.text().then(text => {
                    callback(text);
                });
            } else {
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.text();
                    })
                    .then(text => {
                        caches.open('4re5-cache-v1')
                            .then(cache => {
                                cache.put(url, new Response(text));
                            });
                        callback(text);
                    })
                    .catch(error => {
                        console.error('Error fetching ' + url + ':', error);
                        callback(null);
                    });
            }
        });
}


// returns the header html
function get_header_footer(is_header, callback) {
    var url = is_header ? header_url : footer_url;
    get_file(url, callback);
}

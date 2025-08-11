/*
    4re5 group 2025, all rights reserved.
*/

var header_url = "https://raw.githubusercontent.com/4re5group/4re5group.github.io/main/header.html";
var footer_url = "https://raw.githubusercontent.com/4re5group/4re5group.github.io/main/footer.html";

// Register the service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.warn('ServiceWorker registration failed: ', err);
        });
    });
}

// Function to extract input value from data
function get_import_input(key, data) {
    var regex = new RegExp(key + '="([^"]*)"', 'g');
    var match = regex.exec(data);
    return match ? match[1] : "";
}

// Returns the float value of a version name
function get_version(v)
{
    return (Number(v.replaceAll("beta", "").replaceAll(" ", "").replace(".", "#").replaceAll(".", "").replaceAll("#", ".")));
}


function get_file(url, callback)
{
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
                        // Store the fetched content in cache
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


// Returns the header html
function get_header_footer(is_header, callback) {
    var url = is_header ? header_url : footer_url;
    get_file(url, callback);
}

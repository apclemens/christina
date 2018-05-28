function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function httpGetAsync(theUrl, pathname, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(theUrl, pathname, xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function setAllLinks() {
    lazyload();
    var links = document.getElementsByTagName('a');
    for (var i=0; i<links.length; i++) {
        var link = links[i];
        link.addEventListener('click', function(event) {
            event.preventDefault();
            httpGetAsync(this.href, this.pathname, function(href, pathname, html){
                document.getElementById('content').style.opacity = 0;
                setTimeout(function(){
                    var innerHTML = html.split('<!-- CONTENT -->')[1];
                    var title = html.split('<title>')[1].split('</title>')[0];
                    window.history.pushState({
                        innerHTML: innerHTML,
                        title: title,
                        linkText: pathname == '/' ? 'CV' : "HOME",
                    }, "", href)
                    document.getElementById('content').innerHTML = innerHTML;
                    document.title = title;
                    if (pathname == '/') {
                        document.getElementById('link').innerHTML = '<a href="/cv">CV</a>';
                    } else {
                        document.getElementById('link').innerHTML = '<a href="/">HOME</a>';
                    }
                    document.getElementById('content').style.opacity = 1;
                    setAllLinks();
                }, 250)
            })
        })
    }
}

window.onpopstate = function(event) {
    console.log(event);
    if (event.state) {
        document.getElementById('content').style.opacity = 0;
        setTimeout(function() {
            document.getElementById('content').innerHTML = event.state.innerHTML;
            document.title = event.state.title;
            if (event.state.linkText == 'CV') {
                document.getElementById('link').innerHTML = '<a href="/cv">CV</a>';
            } else {
                document.getElementById('link').innerHTML = '<a href="/">HOME</a>';
            }
            document.getElementById('content').style.opacity = 1;
            setAllLinks();
        }, 250);
    }
}

window.history.pushState({
    innerHTML: document.getElementById('content').innerHTML,
    title: document.title,
    linkText: window.location.pathname == '/' ? 'CV' : "HOME",
}, "", document.location.href);
setAllLinks();


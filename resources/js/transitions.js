function httpGetAsync(theUrl, pathname, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(theUrl, pathname, xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function insertAndExecute(id, text) {
    domelement = document.getElementById(id);
    domelement.innerHTML = text;
    var scripts = [];

    ret = domelement.querySelector('.script_wrap').childNodes;
    for ( var i = 0; ret[i]; i++ ) {
      if ( scripts && nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
            scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
        }
    }

    for(script in scripts)
    {
      evalScript(scripts[script]);
    }
}
function nodeName( elem, name ) {
    return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
}
function evalScript( elem ) {
    data = elem.src;

    var head = document.getElementsByTagName("head")[0] || document.documentElement,
    script = document.createElement("script");
    script.type = "text/javascript";
    script.src = data;
    head.insertBefore( script, head.firstChild );
    head.removeChild( script );

    if ( elem.parentNode ) {
        elem.parentNode.removeChild( elem );
    }
}

function setAllLinks() {
    lazyload();
    var links = document.getElementsByTagName('a');
    for (var i=0; i<links.length; i++) {
        var link = links[i];
        if (link.classList.contains('same_page')) continue;
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
                    insertAndExecute('content', innerHTML);
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


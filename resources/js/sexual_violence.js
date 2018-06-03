---
---

var chapter_heights = {}
var chapters = document.getElementsByClassName('scroll_to');

var content_links = document.getElementsByClassName('scroll_to');
for (var i=0; i<content_links.length; i++) {
    content_links[i].addEventListener('click', function(event){
        event.preventDefault();
        var hash = this.hash;
        document.getElementById(hash.replace('#','')).scrollIntoView({behavior: 'smooth'});
        history.pushState(null, null, hash);
    });
}
function get_active_chapter(scrollTop) {
    var kys = Object.keys(chapter_heights);
    kys.sort(function(a,b){
        var A = chapter_heights[a] > scrollTop ? -1 : chapter_heights[a];
        var B = chapter_heights[b] > scrollTop ? -1 : chapter_heights[b];
        return B-A;
    })
    return kys[0];
}

var active_bio = 'sam';
var active_chapter = 'link_top';
document.getElementById('viewer').addEventListener('scroll', function(event){
    setScrollMagic();
    var this_chapter = get_active_chapter(this.scrollTop);
    if (this_chapter != active_chapter) {
        // gotta change chapters
        document.getElementById(active_chapter).classList.remove('active');
        active_chapter = this_chapter;
        document.getElementById(active_chapter).classList.add('active');
    }
    var center_right = element_in_center_right();
    if (center_right.classList.contains('chapter_4_bio')) {
        var this_bio = center_right.id.replace('chapter_4_', '');
        if (this_bio != active_bio) {
            // gotta change bios
            document.getElementById('chapter_4_'+active_bio).classList.remove('active_bio');
            active_bio = this_bio;
            document.getElementById('chapter_4_image').src="{{ site.assets_url }}/artwork/sexual_violence/"+active_bio+".png";
            document.getElementById('chapter_4_'+active_bio).classList.add('active_bio');
        }
    }
})

function element_in_center_right() {
    var elem = document.getElementById('viewer');
    return document.elementFromPoint(elem.offsetLeft + elem.offsetWidth*3/4,
                                     elem.offsetTop + elem.offsetHeight/2);
}

var scrollMagicSet = false;
var controller = new ScrollMagic.Controller();
window.onresize = function() {setChapterLengths();}
function setScrollMagic() {
    if (scrollMagicSet) return;
    scrollMagicSet = true;

    new ScrollMagic.Scene({
        triggerElement: '#chapter_4_images',
        duration: function() {return document.getElementById('chapter_4_bios').offsetHeight - document.getElementById('chapter_4_images').offsetHeight},
    })
    .setPin('#chapter_4_images')
    .addTo(controller);
/*
    new ScrollMagic.Scene({
        triggerElement: '#chapter_4_prototype_img',
        duration: document.getElementById('chapter_4_prototype').offsetHeight - document.getElementById('chapter_4_prototype_img').offsetHeight})
    .setPin('#chapter_4_prototype_img')
    .addTo(controller);
*/

}

function setChapterLengths() {
    for(var i=0; i<chapters.length; i++) {
        var ch = chapters[i];
        chapter_heights[ch.id] = Math.max(0, document.querySelector(ch.hash).offsetTop - document.getElementById('viewer').offsetTop - 5);
    }
}

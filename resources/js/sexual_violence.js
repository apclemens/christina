---
---

var content_links = document.getElementsByClassName('scroll_to');
for (var i=0; i<content_links.length; i++) {
    content_links[i].addEventListener('click', function(event){
        event.preventDefault();
        var hash = this.hash;
        document.getElementById(hash.replace('#','')).scrollIntoView({behavior: 'smooth'});
        setTimeout(function(){window.location.hash = hash;}, 750);
    });
}
var active_bio = 'sam';

document.getElementById('viewer').addEventListener('scroll', function(){
    var center_right = element_in_center_right();
    if (center_right.classList.contains('chapter_4_bio')) {
        setScrollMagic();
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
function setScrollMagic() {
    if (scrollMagicSet) return;
    scrollMagicSet = true;
    var controller = new ScrollMagic.Controller();
    console.log(document.getElementById('chapter_4_images').offsetHeight);

    new ScrollMagic.Scene({
        triggerElement: '#chapter_4_images',
        duration: document.getElementById('chapter_4_bios').offsetHeight - document.getElementById('chapter_4_images').offsetHeight})
    .setPin('#chapter_4_images')
    .addTo(controller);

    new ScrollMagic.Scene({
        triggerElement: '#chapter_4_prototype_img',
        duration: document.getElementById('chapter_4_prototype').offsetHeight - document.getElementById('chapter_4_prototype_img').offsetHeight})
    .setPin('#chapter_4_prototype_img')
    .addTo(controller);
}

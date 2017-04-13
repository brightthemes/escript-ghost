/***************************************************************************/
/* Script                                                                  */
/***************************************************************************/
$(document).ready(function() {
  'use strict';

  $('.carousel-control').click(function(e){
      e.preventDefault();
      $('#featured-posts__carousel').carousel( $(this).data() );
  });

  // Site navigation
  $(".navbar-open, .navbar-close").on("click", function(e){
      e.preventDefault();

      $(".navbar-navigation").toggleClass("open");

      $("body").toggleClass("nav-opened nav-closed");
  });

  // on scroll, let the interval function know the user has scrolled
  $(window).scroll(function(event) {
    if ($(document).scrollTop() > 100) {
      $('nav').addClass('navbar--scrolled');
    } else {
      $('nav').removeClass('navbar--scrolled');
    }
  });

  // Advertisement div hide when ad block active
  if ($('.ad-unit').is(':hidden')) {
    $('.ad').hide();
  }

  // Lazyload images inside .post
  $('p img').each(function(i, el) {
    $(el).attr('data-src', el.src).addClass('lazyload');
  });
});

// $.getScript("http://bironthemes.disqus.com/count.js");
// Make videos responsive
fitvids();

// Disqus comments
function loadComments(url, id) {
  /**
   *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
   *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
   */
  // var disqus_shortname = 'codehowio'; // required: replace example with your forum shortname
  var disqus_config = function() {
    this.page.url = url;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = id; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
  };

  (function() {  // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
  })();
}
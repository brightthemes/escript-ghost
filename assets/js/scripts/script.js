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

  // $('.search-open').click(function() {
  //   $('.search').show();
  //   $('#search-field').focus();
  //   $('body').css('overflowY', 'hidden');
  // });

  // $('#search-field').keyup(function(e) {
  //   if (e.keyCode === 27) {
  //     $('.search').hide();
  //   }
  // });

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

  // // Site search
  // $('.search-close').click(function() {
  //   $('.search').hide();
  //   $('body').css('overflowY', 'auto');
  // });

  // $('.search-open').click(function() {
  //   $('.search').show();
  //   $('#search-field').focus();
  //   $('body').css('overflowY', 'hidden');
  // });

  // $('#search-field').keyup(function(e) {
  //   if (e.keyCode === 27) {
  //     $('.search').hide();
  //   }
  // });

  // var didScroll;
  // // on scroll, let the interval function know the user has scrolled
  // $(window).scroll(function(event) {
  //   if ($('.navbar-collapse').hasClass('in')) {
  //     $('.navbar-collapse').removeClass('in').addClass('collapse');
  //     $('.navbar-toggle').addClass('collapsed');
  //   }
  // });

  // $('#search-field').ghostHunter({
  //   results         : '#results',
  //   includepages    : true,
  //   onPageLoad      : true,
  //   info_template   : '<p>{{amount}} results found</p>',
  //   result_template : '<div class="col-sm-6 col-xs-12 animated fadeInUp result-item">' +
  //                       '<a href="{{link}}" class="result-link">' +
  //                         '<div class="lazyload no-image result-item-image" style="background-image: url({{image}})"></div>' +
  //                         '<div class="result-item-content">' +
  //                         '<h4>{{title}}</h4>' +
  //                         '<p href="{{authorLink}}">{{authorName}}</p>' +
  //                         '<p><i class="fa fa-calendar-o"></i>{{pubDate}}</p>' +
  //                         '</div>' +
  //                       '</a>' +
  //                     '</div>',
  //   before          : function() {
  //                       $('.slider-after').animate({
  //                         width: '100%'
  //                       }, 800);
  //                     },
  //   onComplete      : function() {
  //                       $('.slider-after').animate({
  //                         width: '0%'
  //                       }, 0);
  //                     }
  // });

  // // Previous & next post responsivness
  // var $prevStory = $('.read-next-story.prev');
  // var $nextStory = $('.read-next-story.next');

  // if ($prevStory.length > 0 && $nextStory.length === 0) {
  //   $prevStory.css('width', '100%');
  // }

  // if ($prevStory.length === 0 && $nextStory.length > 0) {
  //   $nextStory.css('width', '100%');
  // }

  // // Navbar scroll
  // $(window).scroll(function() {
  //   var $navbar = $('.navbar-default');
  //   var scrolledClass = 'navbar-default-scrolled';

  //   if ($(this).scrollTop() > 30) {
  //     $navbar.addClass(scrolledClass);
  //   } else {
  //     $navbar.removeClass(scrolledClass);
  //   };
  // });

  // // Site scroll takes into account the fixed header
  // function scroll_if_anchor(href) {
  //   href = typeof(href) === 'string' ? href : $(this).attr('href');
  //   var fromTop = 50;

  //   if (href.indexOf('#') === 0) {
  //     var $target = $(href);

  //     if ($target.length) {
  //       $('html, body').animate({ scrollTop: $target.offset().top - fromTop });

  //       if (history && 'pushState' in history) {
  //         history.pushState({}, document.title, window.location.pathname + href);
  //         return false;
  //       }
  //     }
  //   }
  // }

  // scroll_if_anchor(window.location.hash);

  // // Intercept all anchor clicks
  // $('body').on('click', 'a', scroll_if_anchor);
});

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

// Related posts
// function getCurrentPosts(id) {
//   $.get(ghost.url.api('posts', { filter: 'id:' + id, include: 'tags' })).done(function(data) {
//     var tags = data.posts[0].tags;
//     getRelatedPosts(id, tags);
//   });
// }

// function getRelatedPosts(id, tags) {
//   tags = tags.map(function(obj) { return obj.slug; }).join(', ');

//   if (tags === undefined || tags.length === 0) {
//     $('#related').hide();
//   } else {
//     tags = '[' + tags + ']';
//     var data = { limit: 6, filter: 'id:-' + id + ' +tags:' + tags, include: 'author, tags' };

//     $.get(ghost.url.api('posts', data)).done(function(data) {
//       var posts = data.posts;
//       if (posts.length > 0) {
//         showRelatedPosts(posts);
//       } else {
//         $('.related-section').hide();
//       }
//     });
//   }
// }

// function showRelatedPosts(posts) {
//   $('.related-section').show();

//   var imageClass = '';

//   for (var i = posts.length - 1; i >= 0; i--) {
//     if (posts[i].image == null || posts[i].image == '') {
//       imageClass = 'no-image';
//     } else {
//       imageClass = '';
//     }
//     $('.related-list').append($(
//       '<li class="col-xs-12 col-sm-6 col-md-12 col-lg-6 related-list-item">' +
//         '<div class="related-card">' +
//           '<a class="lazyload ' + imageClass + ' related-image" href="' + posts[i].url + 
//             '" data-src="' + posts[i].image + '" ' + 'style="background-image:url(' + 
//              posts[i].image + ')">' +
//           '</a>' +
//           '<div class="related-card-content">'+
//             '<h4 class="related-card-title">' +
//               '<a href="' + posts[i].url + '">' + posts[i].title + '</a>' +
//             '</h4>' +
//             '<ul class="related-byline">' +
//               '<li>' + posts[i].author.name + '</li>' +
//               '<li>' + 
//                 '<i class="fa fa-calendar-o"></i>' +
//                 '<time datetime="' + moment(posts[i].published_at).format('YYYY-MM-DD') + '" class="timeago">' +
//                   moment(posts[i].published_at).fromNow() +
//                 '</time>' +
//               '</li>' +
//             '</ul>' +
//           '</div>' +
//         '</div>' +
//       '</li>'
//     ));
//   }
// }

// // Featured posts
// $.get(ghost.url.api('posts', { filter: 'featured: true' })).done(function(data) {
//   var result = data.posts.length;
//   if (result < 4) {
//     $('.featured-articles').removeClass('grid4').addClass('grid' + result);
//   }
// });

// // Tag header adjustment
// var tagConst = '/tag/';
// var hrefValue = document.location.href;
// if (hrefValue.indexOf(tagConst) !== -1) {
//   var hrefValue = hrefValue.split('/');
//   var tagName = hrefValue[4];
//   $('.grid-logo').text(tagName);
//   $.get(ghost.url.api('posts', { filter: 'tag:' + tagName })).done(function(data) {
//     var result = data.posts.length;
//     if (result < 3) {
//       $('.tag-articles').removeClass('grid3').addClass('grid' + result);
//     }
//     if (result <= 3) {
//       $('.latest, .pagination').hide();
//       $('.content').append('<h3 class="no-more-posts">No more posts</h3>');
//     }
//   });
// };

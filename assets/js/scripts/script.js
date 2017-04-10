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

  var ordering = 1;

  // // Timeline adjustment
  // var timelineItemsOdd = $('.demo-card-wrapper .demo-card:odd');
  // for (var i = 0; i <= timelineItemsOdd.length - 1; i++) {
  //   $(timelineItemsOdd[i]).css('order', ordering);
  //   ordering++;
  // }

  //   // var ordering = 1;

  // // Timeline adjustment
  // var timelineItemsEven = $('.demo-card-wrapper .demo-card:even');
  // for (var i = 0; i <= timelineItemsEven.length - 1; i++) {
  //   $(timelineItemsEven[i]).css('order', ordering);
  //   ordering++;
  // }

  var timelineItemsHeight = $('.demo-card-wrapper .demo-card').height();
  var timelineItemsLength = $('.demo-card-wrapper .demo-card').length;
  var totalHeight = 0;

  setTimeout( function(){ 
    $(".demo-card-wrapper .demo-card").each(function(){
      totalHeight = totalHeight + $(this).height();
    });

    var avarageTimelineItemHeight = totalHeight/timelineItemsLength;

    console.log(timelineItemsLength, totalHeight, avarageTimelineItemHeight);

    var newHeight = timelineItemsLength/2 * ( avarageTimelineItemHeight + 90) + 180;
    $('.demo-card-wrapper').css('height', newHeight);
  }, 200 );

  //This is set to 2 since the posts already loaded should be page 1
    var nextPage = 2;
    //Set this to match the pagination used in your blog
    var pagination = 10;

    //on button click
    $('#load-posts').click(function() {
        $.ajax({
            //go grab the pagination number of posts on the next page and include the tags
            url: ghost.url.api("posts") + '&include=tags&limit=' + pagination + '&page=' + nextPage,
            type: 'get'
        }).done(function(data) {
          var postCount = $('.timeline-list .timeline-post').length;
            //for each post returned
            $.each(data.posts, function(i, post) {
              var selector =  (postCount % 2 === 0) ? 'fadeInLeft left' : 'timeline-post--inverted fadeInRight right';
              postCount++;

                //Take the author of the post, and now go get that data to fill in
                $.ajax({
                    url: ghost.url.api("users") + '&filter=id:' + post.author,
                    type: 'get'
                }).done(function(response) {
                  if (i == data.posts.length - 1) {
                    $('.timeline-list .clearfix').remove();
                  }
                  insertPost(post, response.users[0], selector);
                  if (i == data.posts.length - 1) {
                    $('.timeline-list').append('<li class="clearfix"></li>');
                  }
                });
            });
        }).done(function(data) {
            //If you are on the last post, hide the load more button
            if (nextPage == data.meta.pagination.pages) {
              $('#load-posts').hide();
            } else {
              nextPage++;
            }
            $.getScript("http://bironthemes.disqus.com/count.js");
        }).fail(function(err) {
            console.log(err);
        });
    })

    function insertPost(postData, authorData, selector) {
      // remove new lines
      var excerpt = postData.html.replace(/<\/?[^>]+(>|$)/g, "").replace(/\n/g, " ")
        // get first 20 words
        .split(/\s+/).slice(0, 20).join(" ");

      var postInfo =
        '<li class="timeline-post animated ' + selector + '">\
          <div class="timeline-badge primary">\
            <a><i class="fa fa-dot-circle-o" rel="tooltip" title="{{date published_at timeago="true"}}" id=""></i></a>\
          </div>\
          <div class="timeline-card">\
            <div class="timeline-card__thumb">\
              <img src="' + postData.image + '" class="img-responsive lazyload" alt="">\
              <div class="timeline-card--overlay"></div>\
            </div>\
            <div class="timeline-card__content">\
              <h2 class="timeline-card__title"><a href="' + postData.url + '">' + postData.title + '</a></h2>\
              <div class="timeline-card__author">by <a href="#">' + authorData.name + '</a></div>\
              <div class="timeline-card__excerpt">' + excerpt + '&hellip;</div>\
              <div class="timeline-card__info">\
                <time datetime="' + moment(postData.published_at).format('YYYY-MM-DD') + '" class="timeago">' +
                  moment(postData.published_at).fromNow() + '</time>\
                <i class="fa fa-comments-o"></i>\
                <a href="' + window.location.href.slice(0, -1) + postData.url + '#disqus_thread" class="comments comment-count">0</a>\
              </div>\
            </div>\
          </div>\
        </li>'

        //Append the html to the content of the blog
        $('.timeline-list').append(postInfo);
    }
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

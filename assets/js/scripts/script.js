/***************************************************************************/
/* Script                                                                  */
/***************************************************************************/
$(document).ready(function () {
  'use strict';

  // Sticky post share
  if ( $('.social-share').length ) {
    $('.social-share').show();

    var commentTop;
    
    if ($('.subscribe').length) {
      commentTop = $('.subscribe').offset().top;
    }

    if ( $('.author-box').length ) {
       commentTop = $('.author-box').offset().top;
    }
    var top = $('.social-share').offset().top -50;
    var socialHeight = $('.social-share').height();
    var socialTop = $('.social-share').offset().top;

    var postHeight = $('.post-content article').height();

    if (socialHeight >= postHeight) {
      $('.social-share').css('position','relative').css('margin-left','auto').css('text-align','center');
      $('.social-share a').css('display','inline-block');
      $('.social-share button').css('display','inline-block');
    }

    $(window).scroll(function (event) {
      var social = $(this).scrollTop();

      if (social >= top) {
        $('.social-share').addClass('sticky');
      }
      else {
        $('.social-share').removeClass('sticky');
      }

      if (($('.social-share').offset().top - ( commentTop - socialHeight - 50)) >= 0) {
        $('.social-share').removeClass('sticky');
      }
    });
  }

  // Read more section styling
  if ( !$('.read-next__story.prev').length ) {
    $('.read-next__story.next').css('margin-left', '0');
  }

  $('.carousel-control').click(function (e) {
    e.preventDefault();
    $('#featured-posts__carousel').carousel($(this).data());
  });

  // Site navigation
  $(".btn-navbar--open, .btn-navbar--close").on("click", function (e) {
    e.preventDefault();

    $(".navbar-navigation").toggleClass("open");

    $("body").toggleClass("nav--opened nav--closed");
  });

  // on scroll, let the interval function know the user has scrolled
  $(window).scroll(function (event) {
    if ($(document).scrollTop() > 100) {
      $('nav').addClass('navbar--scrolled');
    } else {
      $('nav').removeClass('navbar--scrolled');
    }
  });

  if ( $('.post-without-image').length ) {
    $('.navbar__default').css('backgroundColor', 'rgba(0,0,0,0.85)');
  }

  if ( window.location.pathname === "/" && !$('.featured-post').length ) {
    $('.navbar__default').css('backgroundColor', 'rgba(0,0,0,0.85)');
    $('.latest-posts').css('marginTop', '7em');
  } 

  // Advertisement div hide when ad block active
  if ($('.ad-unit').is(':hidden')) {
    $('.ad').hide();
  }

  // Lazyload images inside .post
  $('p img').each(function (i, el) {
    $(el).attr('data-src', el.src).addClass('lazyload');
  });

  jQuery('.masonry-post').addClass("invisible").viewportChecker({
    classToAdd: 'visible animated fadeIn',
    classToRemove: 'invisible',
    offset: 100
  });

  // Site scroll takes into account the fixed header
  function scroll_if_anchor(href) {
    href = typeof(href) === 'string' ? href : $(this).attr('href');
    var fromTop = 50;

    if (href.indexOf('#') === 0) {
      var $target = $(href);

      if ($target.length) {
        $('html, body').animate({ scrollTop: $target.offset().top - fromTop }, 500);

        if (history && 'pushState' in history) {
          history.pushState({}, document.title, window.location.pathname + href);
          return false;
        }
      }
    }
  }

  scroll_if_anchor(window.location.hash);

  // Intercept all anchor clicks
  $('body').on('click', 'a', scroll_if_anchor);

  // Site search
  $('.btn-search--close').click(function() {
    $('.search').removeClass('open');
  });

  $('.btn-search--open').click(function() {
    $('.search').addClass('open');
    $('#search-field').focus();
  });

  $('#search-field').keyup(function(e) {
    if (e.keyCode === 27) {
      $('.search').removeClass('open');
      $("body").toggleClass("search--opened search--closed");
    }
  });

  $(".btn-search--open, .btn-search--close").on("click", function (e) {
    e.preventDefault();
    $("body").toggleClass("search--opened search--closed");
  });

  // Text area modification
  $('#message').on('keydown', function(e){
    var that = $(this);
    if (that.scrollTop()) {
      var areaHeight = $(this).height();
      if (areaHeight < 200) {
        $(this).height(function(i,h){
          areaHeight = areaHeight + 20;
          return h + 20;
        });
      }
    }
  });

  $('#search-field').ghostHunter({
    results         : '#results',
    onKeyUp         : true,
    includepages    : true,
    onPageLoad      : true,
    info_template   : '<p>{{amount}} results found</p>',
    result_template : '<div class="animated fadeIn result-item">' +
                        '<a href="{{link}}" class="result-link">' +
                          '<div class="result-item-content">' +
                          '<h4>{{title}}</h4>' +
                          '<p>{{pubDate}}</p>' +
                          '</div>' +
                        '</a>' +
                      '</div>'
  });

  $(".masonry").css('visibility', 'visible');
});

var pagination = 0;

function postsPerPage(postsPerPage) {
  pagination = postsPerPage;  
  var currentPosts = $('.masonry-post').length;
  if (currentPosts < pagination) {
    $('.masonry-foot').css('display', 'none');
  }
}

//This is set to 2 since the posts already loaded should be page 1
var nextPage = 2;

var grid = document.querySelector('#grid');
var item = document.createElement('div');
//on button click
function loadAuthorPosts (author) {
  var filter = '';

  if (author !== '' && author !== undefined) {
    var filter = 'author:' + author;
  }

  loadPosts(filter);
}

function loadTagPosts (tag) {
  var filter = '';

  if (tag !== '' && tag !== undefined) {
    filter = 'tags:' + tag;
  }

  loadPosts(filter);
}

function loadPosts(filter) {
  var animateDelay = 0.1;
  if (filter == '' || filter == undefined) {
    filter = 'featured:false';
  }

  $.get(
    //go grab the pagination number of posts on the next page and include the tags
    ghost.url.api('posts', {
      limit: pagination, 
      page: nextPage,
      include: 'tags,author', 
      filter: filter
    })
  ).done(function (data) {
    //for each post returned
    $.each(data.posts, function (i, post) {
      //Now that we have the author and post data, send that to the insertPost function
      var user = post.author;
      insertPost(post, user, animateDelay);
      animateDelay += 0.1;
    });
  }).done(function (data) {
    //If you are on the last post, hide the load more button

    if (nextPage == data.meta.pagination.pages || data.posts.length == 0) {
      $('.masonry-foot').hide();
    } else {
      nextPage++;
    }
  }).fail(function (err) {
    console.log(err);
  });
};

function insertPost(postData, authorData, animate) {
  //start the inserting of the html
  var excerpt = postData.html.replace(/<\/?[^>]+(>|$)/g, "").replace(/\n/g, " ").split(/\s+/).slice(0, 20).join(" ");

  var postInfo = '<div class="masonry-post animated fadeIn" style="animation-delay:' + animate + 's">';

  if (postData.image !== null) {
    postInfo += '<a class="masonry-post__image" href="' + postData.url + '">\
                    <img src="' + postData.feature_image + '" class="lazyload img-responsive" alt="' + postData.title + '">\
                  </a>';
  }

  postInfo += '<div class="masonry-post__content">' +
    '<h2 class="masonry-post__title"><a href="' + postData.url + '">' + postData.title + '</a></h2>' +
    '<h6 class="masonry-post__author">by <a href="' + authorData.url + '">' + authorData.name +  '</a></h6>' +
    '<p class="masonry-post__tags">' + listTags(postData.tags) + '</p>' +
    '<p>' + excerpt + '</p>' +
    '<div class="masonry-post__more clearfix">' +
    '<div class="text-center">' +
    '<a href="' + postData.url + '" class="read-more">Read More</a>' +
    '</div>' +
    '<hr>' +
    '<div class="pull-left">' + moment(postData.published_at).format('MMM DD, YYYY') + '</div>' +
    '<div class="pull-right">' +
    '<div class="masonry-post-share"><i class="fa fa-share-alt"></i></div> ' +
    '<div class="masonry-post-share__social pull-left animated fadeIn">' +
    '<a class="facebook" href=""><i class="fa fa-facebook-official"></i></a>' +
    '<a class="twitter" href=""><i class="fa fa-twitter"></i></a>' +
    '<a class="reddit" href=""><i class="fa fa-reddit"></i></a>' +
    '</div>' +
    '<div class="masonry-post-comment-count">' +
    '<i class="fa fa-comments-o"></i> ' +
    '<span class="disqus-comment-count" data-disqus-url="' + window.location.href.slice(0, -1) + postData.url + '">0</span>' +
    '</div>' +
    '</div' +
    '</div>' +
    '</div>'

  //Append the html to the content of the blog
  // $('.masonry').append(postInfo);
  salvattore.appendElements(grid, [item]);
  item.outerHTML = postInfo;

  DISQUSWIDGETS.getCount({ reset: true });
}

function listTags(tags) {
  var tagList = '';
  for(i=0; i<tags.length; i++) {
    if (i < 5) {
      tagList += '#<a href="/tag' + tags[i].slug + '/">' + tags[i].name + '</a> ';
    }
  }

  return tagList;
}

// Make videos responsive
fitvids();

// Disqus comments
function loadComments(url, id) {
  /**
   *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
   *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
   */
  // var disqus_shortname = 'codehowio'; // required: replace example with your forum shortname
  var disqus_config = function () {
    this.page.url = url;  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = id; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
  };

  (function () {  // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    s.setAttribute('data-timestamp', + new Date());
    (d.head || d.body).appendChild(s);
  })();
}

function isInViewport(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top < (window.pageYOffset + window.innerHeight) &&
    left < (window.pageXOffset + window.innerWidth) &&
    (top + height) > window.pageYOffset &&
    (left + width) > window.pageXOffset
  );
}

// Copy to clipboard
function copyTextToClipboard(text) {
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    alert('Link copied to clipboard.');
  } catch (err) {
    console.log('Unable to copy');
  }
}

function copyLink() {
  copyTextToClipboard(location.href);
}
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

  // ================
  // Lazy load images
  // ================
  var lazyLoad = new LazyLoad({
    elements_selector: ".lazyload",
    treshold: 0,
    class_loading: "loading",
    class_loaded: "lazyloaded",
    callback_enter: function(el) {
      el.classList.add('loading');
    },
    callback_set: function(el) {
      el.classList.add('lazyloaded');
    }
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

  // $('#search-field').ghostHunter({
  //   results         : '#results',
  //   onKeyUp         : true,
  //   includepages    : true,
  //   onPageLoad      : true,
  //   info_template   : '<p>{{amount}} results found</p>',
  //   result_template :
  // });

  console.log('ghos_data: ', ghost_host, ghost_key);

  let ghostSearch = new GhostSearch({
    key: ghost_key,
    url: ghost_host,
    version: 'v3',
    template: function(result) {
      let url = [location.protocol, '//', location.host].join('');
      return '<div class="animated fadeIn result-item">' +
                '<a href="' + url + '/' + result.slug + '" class="result-link">' +
                  '<div class="result-item-content">' +
                  '<h4>' + result.title + '</h4>' +
                  '<p>' + moment(result.published_at).format("MMM Do YYYY") + '</p>' +
                  '</div>' +
                '</a>' +
              '</div>'
    },
    trigger: 'focus',
    api: {
      resource: 'posts',
      parameters: {
          limit: 'all',
          fields: ['title', 'slug', 'published_at'],
          filter: '',
          include: '',
          order: '',
          formats: '',
      },
    }
  });

  $(".masonry").css('visibility', 'visible');

  // ==========================
  // Disqus commen count script
  // ==========================
  // (function() {
  //   var s = document.createElement('script'); s.async = true;
  //   s.src = '//' + disqus_shortname + '.disqus.com/count.js';
  //   (document.getElementsByTagName('BODY')[0]).appendChild(s);
  // }());


  // =============
  // Image Gallery
  // =============
  var images = document.querySelectorAll('.kg-gallery-image img');
  images.forEach(function (image) {
      var container = image.closest('.kg-gallery-image');
      var width = image.attributes.width.value;
      var height = image.attributes.height.value;
      var ratio = width / height;
      container.style.flex = ratio + ' 1 0%';
  })
});

var pagination = 0;

function postsPerPage(postsPerPage) {
  pagination = postsPerPage;
  var currentPosts = $('.masonry-post').length;
  if (currentPosts < pagination) {
    $('#load-posts').css('cursor', 'not-allowed');
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

  loadPosts(api,filter);
}

function loadPosts(filter) {
  var animateDelay = 0.1;
  if (filter == '' || filter == undefined) {
    filter = 'featured:false';
  }

  const api = new GhostContentAPI({
    url: ghost_host,
    key: ghost_key,
    version: "v3"
  });

    api.posts.browse({
      limit: pagination,
      page: nextPage,
      include: 'tags,authors',
      filter: filter
    })
  .then(function (data) {
    console.log(data.meta.pagination.next, data.meta.pagination.pages);
    //for each post returned

    if (data.meta.pagination.next == data.meta.pagination.pages || data.length == 0) {
      $('.masonry-foot').hide();
    } else {
      nextPage++;
    }

    $.each(data, function (i, post) {
      //Now that we have the author and post data, send that to the insertPost function
      var user = post.authors[0];
      insertPost(post, user, animateDelay);
      animateDelay += 0.1;
    });

  }).catch(function (err) {
    console.log(err);
  });
};

function insertPost(postData, authorData, animate) {
  //start the inserting of the html
  var excerpt = postData.html.replace(/<\/?[^>]+(>|$)/g, "").replace(/\n/g, " ").split(/\s+/).slice(0, 20).join(" ");

  var postInfo = '<div class="masonry-post animated fadeIn" style="animation-delay:' + animate + 's">';

  if (postData.feature_image !== null) {
    postInfo += '<a class="masonry-post__image" href="' + postData.url + '">\
                    <img src="' + postData.feature_image + '" class="lazyload img-responsive" alt="' + postData.title + '">\
                  </a>';
  }

  postInfo += '<div class="masonry-post__content">' +
    '<h2 class="masonry-post__title"><a href="' + postData.url + '">' + postData.title + '</a></h2>' +
    '<h6 class="masonry-post__author">by <a href=/author/' + authorData.slug + '>' + authorData.name +  '</a></h6>' +
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

  // DISQUSWIDGETS.getCount({ reset: true });
}

function listTags(tags) {
  var tagList = '';
  for(i=0; i<tags.length; i++) {
    if (i < 5) {
      tagList += '#<a href="/tag/' + tags[i].slug + '/">' + tags[i].name + '</a> ';
    }
  }

  return tagList;
}

// Make videos responsive
fitvids();

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

// ==================
// Add class function
// ==================
function addClass(selector, myClass) {
  // get all elements that match our selector
  elements = document.querySelectorAll(selector);

  // add class to all chosen elements
  for (var i=0; i<elements.length; i++) {
    elements[i].classList.add(myClass);
  }
}

// =====================
// Remove class function
// =====================
function removeClass(selector, myClass) {
  // get all elements that match our selector
  elements = document.querySelectorAll(selector);

  // remove class from all chosen elements
  for (var i=0; i<elements.length; i++) {
    elements[i].classList.remove(myClass);
  }
}

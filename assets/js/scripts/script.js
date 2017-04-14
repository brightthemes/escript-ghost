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

//This is set to 2 since the posts already loaded should be page 1
  var nextPage = 2;
  //Set this to match the pagination used in your blog
  var pagination = 1;

  //on button click
  $('#load-posts').click(function() {
      $.ajax({
          //go grab the pagination number of posts on the next page and include the tags
          url: ghost.url.api("posts") + '&include=tags&limit=' + pagination + '&page=' + nextPage,
          type: 'get'
      }).done(function(data) {
          //for each post returned
          $.each(data.posts, function(i, post) {
              //Take the author of the post, and now go get that data to fill in
              $.ajax({
                  url: ghost.url.api("users") + '&filter=id:' + post.author,
                  type: 'get'
              }).done(function(data) {
                  $.each(data.users, function(i, users) {
                      //Now that we have the author and post data, send that to the insertPost function
                      console.log(users);
                      insertPost(post, users);
                  });
              });
          });
      }).done(function(data) {
          //If you are on the last post, hide the load more button
          if (nextPage == data.meta.pagination.total) {
              $('#load-posts').hide();
          }
      }).fail(function(err) {
          console.log(err);
      });
  })

  function insertPost(postData, authorData) {

      console.log(postData);
      //start the inserting of the html
      var excerpt = postData.html.replace(/<\/?[^>]+(>|$)/g, "").replace(/\n/g, " ").split(/\s+/).slice(0, 20).join(" ");

      var postInfo = '<div class="masonry-item animated fadeIn">';

      if (postData.image !== null) {
        postInfo += '<a class="masonry-post__image" href="' + postData.url + '">\
                      <img src="' + postData.image + '" class="lazyload img-responsive" alt="' + postData.title + '">\
                    </a>';
      }
      
      postInfo += '<div class="masonry-post__content">' + 
                    '<h2 class="post-title"><a href="' + postData.url + '">' + postData.title + '</a></h2>' + 
                    '<h6 class="post-info">by <a href="">' + authorData.name + '</a></h6>' + 
                    '<p>' + excerpt + '</p>' + 
                    '<div class="tag-comment clearfix">' + 
                      '<div class="text-center">' + 
                        '<a href="' + postData.url + '" class="read-more">Read More</a>' + 
                      '</div>' + 
                      '<hr>' + 
                      '<span class="pull-left">' + moment(postData.published_at).format('MMM DD, YYYY') + '</span>' +
                      '<span class="pull-right">' +
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
                      '</span' +
                    '</div>' +
                  '</div>'

      //Append the html to the content of the blog
      $('.masonry').append(postInfo);

      DISQUSWIDGETS.getCount({reset: true});
      //incriment next page so it will get the next page of posts if hit again.
      nextPage += 1;
  }

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
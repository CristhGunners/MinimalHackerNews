$(document).ready(function () {
  try {
    if (type_stories === 'Top') {
      var url = 'https://hacker-news.firebaseio.com/v0/topstories.json';
      var datenow = new Date();
      var dateformat = moment(datenow).format('Do MMMM, YYYY');
      $('.list h3#date span.datenow').html(dateformat);
    } else if (type_stories === 'Best') {
      var url = 'https://hacker-news.firebaseio.com/v0/beststories.json';
    }
  } catch (e) {}

  var sv = 25;
  var stories = [];
  var buttonlm = $('button#more');
  var loading = $('.loading');

  $.ajaxSetup({
    beforeSend: function () {
      loading.removeClass('off');
      buttonlm.removeClass('on');
    },
  });

  function addStories(s, e) {
    $.each(stories.slice(s, e), function (i, field) {
      $.getJSON(
        'https://hacker-news.firebaseio.com/v0/item/' +
          field +
          '.json?print=pretty',
        function (post) {
          var d = new Date(post.time);
          $('#articles')
            .append(
              "<article><div class='info'><h2><a href=" +
                post.url +
                " target='_blank' rel='nofollow noreferrer noopener'>" +
                post.title +
                "</a></h2><div class='detail'><span>" +
                post.score +
                ' points</span><span>' +
                post.by +
                '</span><span>' +
                post.type +
                '</span><span><a href=https://news.ycombinator.com/item?id=' +
                post.id +
                " target='_blank' rel='nofollow noreferrer noopener'>" +
                post.descendants +
                ' comments</a></span><span>' +
                moment.unix(d).fromNow() +
                '</span></div></div></article>'
            )
            .promise()
            .done(function () {
              if ($(this).children().length === s + 25) {
                if (stories.length > sv) {
                  buttonlm.addClass('on');
                }
                loading.addClass('off');
              }
            });
        }
      );
    });
  }

  $.getJSON(url, function (result) {
    stories = result;

    addStories(0, sv);

    if (stories.length > sv) {
      buttonlm.on('click', function () {
        addStories(sv, sv + 25);
        sv = sv + 25;
      });
    }
  });

  $('section.list').on('click', 'button.share', function () {
    $(this).addClass('off');
    $(this).siblings('a').addClass('on');
  });
});

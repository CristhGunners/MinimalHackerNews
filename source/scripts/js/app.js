$(document).ready(function () {
  if (type_stories === 'Top') {
    var url = 'https://hacker-news.firebaseio.com/v0/topstories.json';
    var datenow = new Date();
    var dateformat = moment(datenow).format('DD of MMMM, YYYY');
    $('.list h3#date span.datenow').html(dateformat);
  } else if (type_stories === 'Best') {
    var url = 'https://hacker-news.firebaseio.com/v0/beststories.json';
  }

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
                " target='_blank'>" +
                post.title +
                "</a></h2><div class='detail'><h4>" +
                post.score +
                ' points</h4><h4>' +
                post.by +
                '</h4><h4>' +
                post.type +
                '</h4><h4>' +
                post.descendants +
                ' comments</h4><h4>' +
                moment.unix(d).fromNow() +
                '</h4></div></div></article>'
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

/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createTweetElement = (tweet) => {
    const { user, content } = tweet;
    const $tweet = $(
      `<article class='tweet'>
        <header>
          <div>
            <img src='${user.avatars}'>
            <p>${user.name}</p>
          </div>
          <span>${user.handle}</span>
        </header>
        <div class='tweet-body'>
          <p>${escape(content.text)}</p>
        </div>
        <footer>
          <p>10 days</p>
          <div>
            <a>a</a>
            <a>b</a>
            <a>c</a>
          </div>
        </footer>
      </article>`
    );
    return $tweet;
  };

  // Loops through the array of data and appends it to the tweets container
  const renderTweets = (tweets) => {
    for (const tweet of tweets) {
      const $tweet = createTweetElement(tweet);
      $("#tweets-container").prepend($tweet); // to add it to the page so we can make sure it's got all the right elements, classes, etc.
    }
  };

  const loadTweets = () => {
    $.getJSON("/tweets").then(function (data) {
      $("#tweets-container").empty();
      renderTweets(data);
    });
  };

  loadTweets();

  $("form").on("submit", function (event) {
    event.preventDefault();
    const data = $(this).serialize();
    const input = data.replace(/%20/g, "").split("=")[1];
    if (!input || input.length > 140) {
      $("#form").prepend($(`<div id="error-message">
      <p>Invalid tweet! Please stay within the 140 char limit</p>
    </div>`));
    } else {
      $.post("/tweets", data).then(function (cool) {
        loadTweets();
        $("#tweet-text").val("");
        $("#tweet-text").focus();
      });
    }
  });
});
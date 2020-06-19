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
    const { user, content, created_at } = tweet;
    const elapsedDays = calculateDays(created_at)
    const safeText = escape(content.text);
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
          <p>${safeText}</p>
        </div>
        <footer>
          <p>${elapsedDays}</p>
          <div>
            <i class="button fas fa-flag"></i>
            <i class="button fas fa-retweet"></i>
            <i class="button fas fa-heart"></i>
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
      $("#tweets-container").prepend($tweet);
    }
  };

  // Calls renderTweets and then loads them onto the DOM
  const loadTweets = () => {
    $.getJSON("/tweets").then(function (data) {
      $("#tweets-container").empty();
      renderTweets(data);
    });
  };

  // Calculate the time between posting and current time
  const calculateDays = (date) => {
    const currentDate = Date.now()
    const elapsedTime = (currentDate - date)
    let day, hour, minute, seconds;
    seconds = Math.floor(elapsedTime / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    if (day > 0) {
      return `${day} Days`
    }
    if (hour > 0) {
      return `${hour} Hours`
    }
    if (minute >= 0) {
      return `${minute} Minutes`
    }
  }

  loadTweets();

  // Listeners
  // Submit button click to make new tweet
  $("form").on("submit", function (event) {
    event.preventDefault();
    const data = $(this).serialize();
    const input = data.replace(/%20/g, "").split("=")[1];
    if (!input || input.length > 140) {
      $("#form").prepend($(`<div id="error-message">
      <p>Invalid tweet! Please stay within the 140 char limit</p>
    </div>`));
    } else {
      $.post("/tweets", data).then(function () {
        loadTweets();
        $("#tweet-text").val("");
        $("#tweet-text").focus();
      });
    }
  });

  // Scroll animation to text area
  $("#new-tweet-link a").click(function() {
    $("#tweet-text").focus();
    $('html,body').animate({
      scrollTop: 0
    }, 'slow');
  });
});
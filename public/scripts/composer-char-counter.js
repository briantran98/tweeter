$(document).ready(function() {
  // --- our code goes here ---
  $('#tweet-text').keyup(function() {
    const textLength = $(this).val().length
    const charLimit = 140;
    const charCounter = $(this).next().children('.counter').val(charLimit - textLength);
    if (charCounter.val() < 0) {
      charCounter.css('color', 'red')
    } else {
      charCounter.css('color', 'inherit')
    }
  });
});
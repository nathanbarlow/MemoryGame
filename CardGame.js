//Global Variables
var incorrectCardsBoolean = false;
var timerState = false;
var timerVar;
var moveCount = 0;
var playerScore = 30;

//Once document is loaded
$( document ).ready(function(){
  //place image on card backs
  var htmlImg = '<img src="Images/questionMark.png" alt="Question Mark" class="frontImage">'
  $(".front").html(htmlImg);

  //flip card on click
  cardFlipProcedure();

  //scale card on mouseover
  $('.card').mouseover(function() {
    $(this).transition({
      scale: 1.08,
      duration: 30
    });
  });
  $('.card').mouseleave(function() {
    $(this).transition({
      scale: 1,
      duration: 60
    });
  });

  //assign card backs on page loaded
  assignCards();

  //reset button
  $('.resetButton').click(function(){
    reset();
  });

}); //end of document ready function

function assignCards() {
  //randomly assign letter to card back content
  //https://image.flaticon.com/sprites/new_packs/194176-animals.png
  var cardBacks = [
    '<img src="Images/card1.png" alt="dog" class="animalImage">',
    '<img src="Images/card2.png" alt="bee" class="animalImage">',
    '<img src="Images/card3.png" alt="cat" class="animalImage">',
    '<img src="Images/card4.png" alt="grey dog" class="animalImage">',
    '<img src="Images/card5.png" alt="fox" class="animalImage">',
    '<img src="Images/card6.png" alt="monkey" class="animalImage">',
    '<img src="Images/card7.png" alt="pig" class="animalImage">',
    '<img src="Images/card8.png" alt="frog" class="animalImage">'
  ];

  //dublicate each item by adding the list to itself
  cardBacks =cardBacks.concat(cardBacks);

  console.log(cardBacks);

  $('.back').each(function(){
    //pick a random card back from the list
    var randomCardBackIndex = Math.floor(Math.random() * (cardBacks.length));

    //assign the cardBack element to the div with class "back"
    $(this).html(cardBacks[randomCardBackIndex]);

    //remove the element from the list
    cardBacks.splice(randomCardBackIndex, 1);
  });
}

function cardFlipProcedure() {
  $('.card').on('click', function (){

    //turn timmer on
    timer(true);

    /*
    check if card is not already flipped and not correct and
    incorrectCardsBoolean is not true
    */
    if($(this).hasClass('flipped') == false
    && $(this).hasClass('correct') == false
    && incorrectCardsBoolean == false) {

      flipCard(this);

      //check if this is the second card being flipped
      if($('.flipped').length == 2) {
        var flippedCards = $('.flipped');

        //Update move count
        updateMoveCount();

        //check if cards match
        if(flippedCards[0].innerHTML == flippedCards[1].innerHTML) {
          correctCards();

          //check for win conditions
          winCondition ();

        } else {
          //flip cards back over after delay
          incorrectCardsBoolean = true;
          window.setTimeout(incorrectCards, 700);
        };
      };

    } else {
      console.log("card is already flipped");
    };
  });
}

function flipCard(element) {
  if($(element).hasClass("flipped")){
    //animating the element
    $(element).transition({
       rotateY: 0,
    });
  } else {
    $(element).transition({
       rotateY: 180,
    });
  };
  $(element).toggleClass("flipped");
}

function incorrectCards() {
  $('.flipped').each(function() {
    flipCard(this);
  });
  //decrease score
  modifyScore(-5);

  //reset incorrectCardsBoolean
  incorrectCardsBoolean = false;
}

function correctCards() {
  $('.flipped').each(function() {
    $(this).find('.back').css("background-color","#c9d8c5");
    $(this).toggleClass("flipped");
    $(this).toggleClass("correct");
  });
  //increase score
  modifyScore(2.5);
}

function modifyScore(change) {
  //update the global variable playerScorescore
  playerScore += change;

  //change html to refference particular images
  if (playerScore > 20){
    //3 gold stars
    $('#star1').attr('src', 'Images/happyStar.png');
    $('#star2').attr('src', 'Images/happyStar.png');
    $('#star3').attr('src', 'Images/happyStar.png');
  } else if (playerScore > 10) {
    //2 gold stars
    $('#star1').attr('src', 'Images/happyStar.png');
    $('#star2').attr('src', 'Images/happyStar.png');
    $('#star3').attr('src', 'Images/greyStar.png');
  } else if (playerScore > 0) {
    //1 gold stars
    $('#star1').attr('src', 'Images/happyStar.png');
    $('#star2').attr('src', 'Images/greyStar.png');
    $('#star3').attr('src', 'Images/greyStar.png');
  } else {
    //0 gold stars
    $('#star1').attr('src', 'Images/greyStar.png');
    $('#star2').attr('src', 'Images/greyStar.png');
    $('#star3').attr('src', 'Images/greyStar.png');
  }
}

function reset() {
  window.location.reload();
}

function timer(changeState) {

  /*
  if the requested changeState is true and the timerState is
  currently false then start the timer and change the timerState
  to true
  */
  if(changeState == true && timerState == false){
    //set global timerVar to run the secondsUpdate function every second
    timerVar = setInterval(secondsUpdate, 1000);
    var secondsPassed = $('#timer').text();

    function secondsUpdate() {
      secondsPassed = parseInt(secondsPassed) + 1;
      $('#timer').text(secondsPassed);
    }
    //change the global variable timerState to true
    timerState = true;

  } else if(changeState == false && timerState == true){
    /*
    if the requested changeState is false and the timerState is
    currently true then stop the timer and change the timerState
    to false
    */
    clearInterval(timerVar);
    //change the global variable timerState to false
    timerState = false;
  }
}

function winCondition() {
  if($('.correct').length == $('.card').length) {
    //pause timerVar
    timer(false);

    //popup window with score and resetButton
    $('#bannerShading').css("visibility", "visible");

    //fill in popup window contents
    //score
    var score = $('#starScore').html();
    $('#scoreDiv').html(score);

    //time
    var time = $('#timerBox').html();
    $('#timeDiv').html(time);

    //moves
    var moves = $('#moveContainer').html();
    $('#turnsDiv').html(moves);
  };
}

function updateMoveCount() {
  //increase global variable moveCount
  moveCount ++;
  //update displayed move count
  $('#moveCount').text(moveCount);
}

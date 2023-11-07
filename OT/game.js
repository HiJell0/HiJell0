function makeChoice(choice) {
  var image = document.getElementById('scene-image');
  var choiceAButton = document.getElementById('choiceA-button');
  var choiceBButton = document.getElementById('choiceB-button');


  // Logic for handling the game choices and outcomes
  switch (choice) {
    case 'choiceA':
      image.src = "images/a1.png";
      break;

    case 'choiceB':
      image.src = "images/b1.png";
      break;
  }
}

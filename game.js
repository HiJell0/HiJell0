function makeChoice(choice) {
  var image = document.getElementById('scene-image');

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

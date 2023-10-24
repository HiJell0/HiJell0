function makeChoice(choice) {
  var image = document.getElementById('scene-image');
  var text = document.getElementById('scene-text');

  // Logic for handling the game choices and outcomes
  switch (choice) {
    case 'choiceA':
      text.innerHTML = "You made choice A!";
      image.src = "images/image2.jpg"; // Path should be relative to the location of your HTML file
      break;

    case 'choiceB':
      text.innerHTML = "You made choice B!";
      image.src = "images/image3.jpg";
      break;

    //... more cases ...

    default:
      text.innerHTML = "Your adventure begins in a mysterious forest. Which path will you take?";
      image.src = "images/start-image.jpg";
  }

  // Additional game logic...
}

// JavaScript to handle button click
document.getElementById('sayHelloButton').onclick = function() {
    // Update the URL to match your Java server endpoint
    fetch('http://localhost:8080/sayhello')
        .then(response => response.text())
        .then(data => alert(data))
        .catch(error => console.error('Error:', error));
};

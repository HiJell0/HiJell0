document.addEventListener('DOMContentLoaded', (event) => {
    const ws = new WebSocket('ws://localhost:8887'); // Adjust the URL to match your WebSocket server

    ws.onopen = function() {
        console.log("Connected to the server.");
    };

    ws.onerror = function(error) {
        console.log("WebSocket error: " + error);
    };

    document.getElementById('sayHelloButton').addEventListener('click', () => {
        ws.send('hello');
        console.log("Sent 'hello' message to the server.");
    });
});

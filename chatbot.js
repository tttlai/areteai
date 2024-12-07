// chatbot.js

// function sendMessage() {
//     var userInput = document.getElementById("user-input").value;
//     appendMessage("User: " + userInput, "user");
//     document.getElementById("user-input").value = "";

//     setTimeout(function () {
//         var botResponse = "Hi, I am your AI chatbot. How can I help you?";
//         appendMessage("Bot: " + botResponse, "bot");
//     }, 500);
// }

// function sendMessage() {
//     var userInput = document.getElementById("user-input").value;
//     appendMessage("User: " + userInput, "user");
//     document.getElementById("user-input").value = "";

//     // Replace 'YOUR_API_KEY' with your actual OpenAI API key
//     var apiKey = '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';

    
//     // Make a request to your ChatGPT API endpoint
//         fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + apiKey,
//         },
//         body: JSON.stringify({
//             model:'gpt-3.5-turbo-1106',
//             messages: [{ role: 'system', content: userInput }],
//         }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('API Response:', data);  // Log the response for debugging
//         var botResponse = data.choices[0].message.content || "Sorry, I couldn't understand that.";
//         appendMessage("Bot: " + botResponse, "bot");
//     })
//     .catch(error => {
//         console.error('Error fetching data:', error);
//         appendMessage("Bot: Sorry, an error occurred.", "bot");
//     });
// }
var apiKey = 'sk-RIyvyIme6UmHNWJtln6rT3BlbkFJ0vh7uNZgKItOQzQNLSt';
var threadId;

function sendMessage() {

    var userInput = document.getElementById("user-input").value;
    appendMessage("User: " + userInput, "user");
    if(threadId == null){
    createThread(userInput);
    }
    else{
        console.log('Thread exists:', threadId);
        appendMessage("Thread ID: " + threadId, "bot");
        createMessageInThread(threadId, userInput);
    }
}

function createThread(userInput) {
    // Replace 'YOUR_API_KEY' with your actual OpenAI API key
    // var apiKey = 'YOUR_API_KEY';

    // Replace 'YOUR_ASSISTANT_API_ENDPOINT' with the actual OpenAI API endpoint
    var apiEndpoint = 'https://api.openai.com/v1/threads';

    // Make a request to create a new thread
    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey,
            'OpenAI-Beta': 'assistants=v1',
        },
        body: JSON.stringify({}),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Thread Created:', data);  // Log the response for debugging

        // Use the obtained thread ID to create a message
        if (data && data.id) {
            threadId = data.id;
            createMessageInThread(data.id, userInput);
            appendMessage("Thread ID: " + data.id, "bot");
        } else {
            console.error('Thread ID not found in the response.');
        }
    })
    .catch(error => {
        console.error('Error creating thread:', error);
        // Handle the error here
    });
}

function createMessageInThread(threadId, userInout) {
    var userInput = document.getElementById("user-input").value;
    document.getElementById("user-input").value = "";

    // Replace 'YOUR_API_KEY' with your actual OpenAI API key

    var apiEndpoint = 'https://api.openai.com/v1/threads/' + threadId + '/messages';
    // Make a request to your ChatGPT API endpoint
    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey,
            'OpenAI-Beta': 'assistants=v1',
        },
        body: JSON.stringify({
            role: 'user',
            content: userInput,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Message Created:', data);  // Log the response for debugging
        var botResponse = data.thread_id || "Sorry, I couldn't understand that.";
        var msgId = data.id || "Sorry, I couldn't understand that.";
        // appendMessage("Bot Thread ID: " + threadId, "bot");
        // appendMessage("Bot Message ID: " + msgId, "bot");
        var assistant_id = 'asst_msFbi4foeEEf4MNKdOravPEh';
        createRun(threadId,assistant_id,msgId);
    })
    .catch(error => {
        console.error('Error creating message:', error);
        // Handle the error here
    });
    
}


function createRun(threadId, assistantId,msgId) {
    // Replace 'YOUR_API_KEY' with your actual OpenAI API key
    // Replace 'YOUR_THREAD_ID' with the actual thread ID
    // Replace 'YOUR_ASSISTANT_ID' with the actual assistant ID
    var apiEndpoint = 'https://api.openai.com/v1/threads/'+threadId+'/runs';

    // Your existing code...
    fetch(apiEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey,
            'OpenAI-Beta': 'assistants=v1',
        },
        body: JSON.stringify({
            assistant_id: assistantId,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Run Created:', data);  // Log the response for debugging
        // Process the response data as needed
        var runId = data.id || "Sorry, I couldn't understand that.";
        // appendMessage("Bot Run Id: " + runId, "bot");
        // appendMessage("Bot Run Status: " + data.status, "bot");
        getRun(threadId,runId,msgId)
    })
    .catch(error => {
        console.error('Error creating run:', error);
        // Handle errors as needed
    });
}

function getRun(threadId, runId,msgId) {
    // Replace 'YOUR_API_KEY' with your actual OpenAI API key
    // Replace 'YOUR_THREAD_ID' with the actual thread ID
    // Replace 'YOUR_RUN_ID' with the actual run ID
    var apiEndpoint = 'https://api.openai.com/v1/threads/'+threadId+'/runs/'+runId;
    
    return new Promise((resolve, reject) => {
    function fetchRunStatus() {
    fetch(apiEndpoint, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + apiKey,
            'OpenAI-Beta': 'assistants=v1',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Run Information:', data);  // Log the response for debugging
        // Process the response data as needed
        var runStatus = data.status || "Sorry, I couldn't understand that.";
        if (runStatus == 'completed') {
            // appendMessage("Bot get Run Run Status: " + runStatus, "bot");
             getMessage(threadId,msgId);
            //  getStep(threadId, runId,msgId)
        } else {
            // If not completed, wait for 2 seconds and fetch again
            // appendMessage("Bot get Run Status: " + runStatus, "bot");
            setTimeout(fetchRunStatus, 10000);
        }
    })
    .catch(error => {
        console.error('Error getting run information:', error);
        // Handle errors as needed
    });
}
fetchRunStatus();
});
}


function getMessage(threadId, messageId) {
    // Replace 'YOUR_API_KEY' with your actual OpenAI API key
    // Replace 'YOUR_THREAD_ID' with the actual thread ID
    // Replace 'YOUR_MESSAGE_ID' with the actual message ID
    var apiEndpoint = 'https://api.openai.com/v1/threads/'+threadId+'/messages';

    return new Promise((resolve, reject) => {
        // Fetch the message information
        fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + apiKey,
                'OpenAI-Beta': 'assistants=v1',
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Message Information:', data);
            appendMessage("Bot: "+data.data[0].content[0].text.value, "bot");
        })
        .catch(error => {
            console.error('Error getting message information:', error);
            reject(error);
        });
    });
}



function appendMessage(message, sender) {
    var chatContainer = document.getElementById("chat-container");
    var messageElement = document.createElement("div");
    messageElement.className = sender;
    messageElement.innerHTML = message;
    chatContainer.appendChild(messageElement);
}

function toggleChatbox(forceShow) {
    var chatbox = document.getElementById("chatbot-container");
    var messageIcon = document.getElementById("message-icon");

    if (forceShow || chatbox.style.display === "none") {
        chatbox.style.display = "block";
        messageIcon.style.display = "none";
    } else {
        chatbox.style.display = "none";
        messageIcon.style.display = "block";
    }
}

// setTimeout(function () {
//     toggleChatbox(true);
// }, 5000);
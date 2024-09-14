// Step 1: get DOM
let nextDom = document.getElementById('next');
let prevDom = document.getElementById('prev');

let carouselDom = document.querySelector('.carousel');
let SliderDom = carouselDom.querySelector('.carousel .list');
let thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
let thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
let timeDom = document.querySelector('.carousel .time');

thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
let timeRunning = 3000;
let timeAutoNext = 5000; // Set automatic slide timer to 5 seconds

let runNextAuto = setTimeout(() => {
    nextDom.click();
}, timeAutoNext);

nextDom.onclick = function() {
    showSlider('next');
}

prevDom.onclick = function() {
    showSlider('prev');
}

let runTimeOut;

function showSlider(type) {
    let SliderItemsDom = SliderDom.querySelectorAll('.carousel .list .item');
    let thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');

    if (type === 'next') {
        SliderDom.appendChild(SliderItemsDom[0]);
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]);
        carouselDom.classList.add('next');
    } else {
        SliderDom.prepend(SliderItemsDom[SliderItemsDom.length - 1]);
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]);
        carouselDom.classList.add('prev');
    }
    
    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next');
        carouselDom.classList.remove('prev');
    }, timeRunning);

    // Clear the automatic slide timer when arrows are clicked
    clearTimeout(runNextAuto);
    runNextAuto = null; // Disable further automatic sliding
}

// Re-enable automatic sliding after a specified time (optional)
function restartAutoSlide() {
    runNextAuto = setTimeout(() => {
        nextDom.click();
        restartAutoSlide(); // Restart the automatic slide after clicking
    }, timeAutoNext);
}

// Call this function to start automatic sliding initially
restartAutoSlide();

// Additional functionality for image addition and modal management
let additionDom = document.getElementById('addition');
let fileInput = document.getElementById('fileInput');
let descriptionModal = document.getElementById('descriptionModal');
let closeModal = document.getElementsByClassName('close')[0];
let headingInput = document.getElementById('headingInput');
let descriptionInput = document.getElementById('descriptionInput');
let submitDescription = document.getElementById('submitDescription');

let currentImageData = null; // To store the image data temporarily

additionDom.onclick = function() {
    fileInput.click(); // Trigger the file input when the button is clicked
};

fileInput.onchange = function(event) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentImageData = e.target.result; // Store the image data
            descriptionModal.style.display = "block"; // Show the modal
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
};

// Close the modal when the user clicks on <span> (x)
closeModal.onclick = function() {
    descriptionModal.style.display = "none";
    headingInput.value = ""; // Clear the heading input
    descriptionInput.value = ""; // Clear the description input
};

function scrollToBottom() {
  var height = document.body.scrollHeight;
  window.scrollTo({
    top: height,
    behavior: 'smooth'
  });
}


// Submit the description and add the image to the carousel
submitDescription.onclick = function() {
    const heading = headingInput.value; // Get the heading
    const description = descriptionInput.value; // Get the description
    if (currentImageData && heading && description) {
        // Create a new item for the carousel
        const newItem = document.createElement('div');
        newItem.className = 'item';
        newItem.innerHTML = `
            <img src="${currentImageData}">
            <div class="content">
                <div class="title">EmLiam</div>
                <div class="topic">${heading}</div>
                <div class="des" style="font-size: 25px;">
                    ${description}
                </div>
                <div class="buttons">
                    <button>EDIT</button>
                </div>
            </div>
        `;
        // Append the new item to the carousel list
        SliderDom.appendChild(newItem);
        
        // Also append to the thumbnail section
        const newThumbnail = document.createElement('div');
        newThumbnail.className = 'item';
        newThumbnail.innerHTML = `<img src="${currentImageData}">`;
        thumbnailBorderDom.appendChild(newThumbnail);

        // Reset the input and close the modal
        fileInput.value = ""; // Clear the file input
        descriptionModal.style.display = "none"; // Hide the modal
        headingInput.value = ""; // Clear the heading input
        descriptionInput.value = ""; // Clear the description input
        currentImageData = null; // Reset the image data
    } else {
        alert("Please provide a heading and description!"); // Alert if no heading or description is provided
    }
};

// Close the modal if the user clicks anywhere outside of it
window.onclick = function(event) {
    if (event.target == descriptionModal) {
        descriptionModal.style.display = "none";
        headingInput.value = ""; // Clear the heading input
        descriptionInput.value = ""; // Clear the description input
    }
};



///////////////////////////////////
//chatbox
// Function to create a chat session
const apiKey = 'x316PTtGYSvv7YIGkqyzNTm3klED5vXp';
    const externalUserId = '66e4133ef068cd8a4290888a';
    let sessionId = null;

    async function createChatSession() {
      try {
        const response = await fetch('https://api.on-demand.io/chat/v1/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey
          },
          body: JSON.stringify({
            pluginIds: [],
            externalUserId: externalUserId
          })
        });
        const data = await response.json();
        sessionId = data.data.id; // Extract session ID
      } catch (error) {
        console.error('Error creating chat session:', error);
        sessionId = null;
      }
    }

    async function submitQuery(query) {
      try {
        const response = await fetch(`https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey
          },
          body: JSON.stringify({
            endpointId: 'predefined-openai-gpt4o',
            query: query,
            pluginIds: ['plugin-1726228878'],
            responseMode: 'sync'
          })
        });
        const data = await response.json();
        const answer = data.data?.answer || 'No answer provided';
        return answer;
      } catch (error) {
        console.error('Error submitting query:', error);
        return 'Error submitting query. Please check the console for details.';
      }
    }

    function appendMessage(content, type) {
      const messageElement = document.createElement('div');
      messageElement.classList.add('message');
      messageElement.classList.add(type === 'user' ? 'userMessage' : 'botMessage');
      messageElement.textContent = content;
      document.getElementById('chatHistory').appendChild(messageElement);
      document.getElementById('chatHistory').scrollTop = document.getElementById('chatHistory').scrollHeight; // Auto-scroll to the bottom
    }

    async function handleSubmit() {
      const query = document.getElementById('queryInput').value.trim();
      if (query === '') return;

      if (!sessionId) {
        await createChatSession();
      }

      if (sessionId) {
        appendMessage(query, 'user');
        const answer = await submitQuery(query);
        appendMessage(answer, 'bot');
        document.getElementById('queryInput').value = ''; // Clear input field
      } else {
        appendMessage('Failed to create chat session.', 'bot');
      }
    }

    document.getElementById('submitButton').addEventListener('click', handleSubmit);

    document.getElementById('queryInput').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault(); // Prevent the default Enter key behavior (e.g., form submission)
          handleSubmit();
          document.getElementById('queryInput').value = ''; // Clear input field after submission
        }
      });
      

    // Optional: create a session on page load for a new chat
    (async () => {
      await createChatSession();
    })();
  
 
  

    
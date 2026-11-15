const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const classifyBtn = document.getElementById("classifyBtn");
const statusText = document.getElementById("status");
const results = document.getElementById("results");

let model;
let selectedImage = false;

// Load pretrained MobileNet model
async function loadModel() {

    statusText.textContent = "Loading AI model... Please wait.";

    try {

        model = await mobilenet.load();

        statusText.textContent = "AI Model Loaded Successfully!";

    } catch (error) {

        statusText.textContent =
            "Unable to load AI model. Check your internet connection.";

        console.error(error);
    }
}

// Upload image
imageInput.addEventListener("change", function(event) {

    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {

        statusText.textContent = "Please select a valid image.";

        return;
    }

    const imageURL = URL.createObjectURL(file);

    preview.onload = function() {

        selectedImage = true;

        classifyBtn.disabled = !model;

        statusText.textContent = model
            ? "Image uploaded! Click Classify Image."
            : "Image uploaded! Waiting for AI model.";

        results.innerHTML = "";

        URL.revokeObjectURL(imageURL);
    };

    preview.src = imageURL;

    preview.style.display = "block";

});

// Classify image
async function classifyImage() {

    if (!model || !selectedImage) return;

    classifyBtn.disabled = true;

    statusText.textContent = "Analyzing image...";

    results.innerHTML = "";

    try {

        const predictions = await model.classify(preview, 5);

        statusText.textContent = "Image Classification Completed!";

        predictions.forEach((prediction, index) => {

            const item = document.createElement("div");

            item.className = "result-item";

            const title = document.createElement("span");

            title.textContent =
                `${index + 1}. ${prediction.className}`;

            const confidence = document.createElement("p");

            confidence.textContent =
                `Confidence: ${(prediction.probability * 100).toFixed(2)}%`;

            item.append(title, confidence);

            results.appendChild(item);

        });

    } catch (error) {

        statusText.textContent = "Classification failed. Try another image.";

        console.error(error);

    } finally {

        classifyBtn.disabled = false;

    }
}

// Initialize AI model
loadModel();
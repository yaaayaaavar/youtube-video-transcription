const form = document.getElementById("summarize-form");
const resultsDiv = document.getElementById("results");
const summaryTextDiv = document.getElementById("summary-text");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const videoUrl = document.getElementById("video_url").value;
    resultsDiv.style.display = "none";
    loadingDiv.style.display = "block";
    errorDiv.style.display = "none";
    summaryTextDiv.innerText = "";
    errorMessage.innerText = "";


    try {
        const response = await fetch("/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `video_url=${encodeURIComponent(videoUrl)}`,
        });

        const data = await response.json();
        loadingDiv.style.display = "none";

        if (response.ok) {
          resultsDiv.style.display = "block";
          summaryTextDiv.innerText = data.summary;
        } else {
          errorDiv.style.display = "block";
          errorMessage.innerText = data.error || "An error occurred.";
        }

    } catch (error) {
        loadingDiv.style.display = "none";
        errorDiv.style.display = "block";
        errorMessage.innerText = "An unexpected error occurred.";
        console.error("Error:", error);
    }
});


async function sendMessage(message) {
    const response = await fetch("https://thekartik7.runasp.net/api/Chat", {
        method: "POST",
        headers: {
            "accept": "text/plain",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.text();
    return result;
}

// Call it
sendMessage("pointer is features in C validate this answer")
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error(error);
    });
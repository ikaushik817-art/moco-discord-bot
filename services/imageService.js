
const axios = require("axios");

const generateImage = async (prompt) => {
    try {
        const response = await axios.post(
            "https://gateway.pixazo.ai/flux-1-schnell/v1/getData",
            {
                prompt: prompt,
                num_steps: 4,
                seed: 15,
                height: 512,
                width: 512,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                    "Ocp-Apim-Subscription-Key":
                        process.env.PIXAZO_API_KEY,
                },
            }
        );

        console.log("PIXAZO RESPONSE:", response.data);

        // Pixazo returns the generated image in its response
        return response.data.output || response.data.image || response.data;

    } catch (error) {

    console.error(
        "PIXAZO IMAGE ERROR:",
        error.response?.status,
        error.response?.data || error.message
    );

    // Rate limit
    if (error.response?.status === 429) {
        const rateLimitError = new Error("IMAGE_RATE_LIMIT");
        rateLimitError.code = "IMAGE_RATE_LIMIT";
        throw rateLimitError;
    }

    throw error;
}
};

module.exports = generateImage;


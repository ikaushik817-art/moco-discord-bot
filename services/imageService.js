
const axios = require("axios");

const generateImage = async (prompt) => {
    try {
        const response = await axios.post(
            "https://gateway.pixazo.ai/getImage/v1/getSDXLImage",
            {
                prompt: prompt,
                negative_prompt: "blurry, low quality, distorted, bad anatomy, extra fingers, extra limbs, watermark, text",
                height: 1024,
                width: 1024,
                num_steps: 20,
                guidance_scale: 5,
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


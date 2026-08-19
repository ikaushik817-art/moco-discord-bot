const axios = require("axios");

const generateImage = async (prompt) => {
    try {
        const response = await axios.post(
            "https://gateway.pixazo.ai/getImage/v1/getSDXLImage",
            {
                prompt: prompt,
                negative_prompt:
                    "blurry, low quality, distorted, bad anatomy, extra fingers, extra limbs, watermark, text",
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

        console.log(
            "PIXAZO RESPONSE:",
            response.data
        );

        // Pixazo returns:
        // { imageUrl: "https://....png" }

        if (!response.data?.imageUrl) {
            throw new Error("IMAGE_URL_NOT_FOUND");
        }

        return response.data.imageUrl;

    } catch (error) {

        console.error(
            "PIXAZO IMAGE ERROR:",
            error.response?.status,
            error.response?.data || error.message
        );

        if (error.response?.status === 429) {
            const rateLimitError =
                new Error("IMAGE_RATE_LIMIT");

            rateLimitError.code =
                "IMAGE_RATE_LIMIT";

            throw rateLimitError;
        }

        throw error;
    }
};

module.exports = generateImage;

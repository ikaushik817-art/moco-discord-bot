const axios = require("axios");

const generateImage = async (prompt) => {
    try {

        // 🎨 Improve the user's prompt
        const enhancedPrompt = `
High quality, highly detailed digital artwork.
Sharp focus, clean details, professional composition,
beautiful lighting, detailed textures, realistic shadows,
excellent proportions, polished final image.

${prompt}

Highly detailed, visually appealing, clean and sharp result.
`;

        const response = await axios.post(
            "https://gateway.pixazo.ai/getImage/v1/getSDXLImage",
            {
                prompt: enhancedPrompt,

                negative_prompt:
                    "blurry, low quality, pixelated, distorted, deformed, ugly, bad anatomy, bad proportions, extra fingers, missing fingers, extra limbs, duplicate body parts, disfigured face, malformed hands, cropped, watermark, text, logo, noisy, oversaturated",

                height: 1024,
                width: 1024,

                num_steps: 30,

                guidance_scale: 7,
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

        // Pixazo response:
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

        // 🚫 Rate limit
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

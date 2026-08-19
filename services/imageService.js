const axios = require("axios");

const generateImage = async (prompt) => {
    try {

        const enhancedPrompt = `
High quality, photorealistic image,
sharp focus, realistic skin texture,
natural lighting, detailed face,
professional photography, realistic proportions,
highly detailed, cinematic quality.

${prompt}
`;

        const response = await axios.post(
            "https://gateway.pixazo.ai/getImage/v1/getSDXLImage",
            {
                prompt: enhancedPrompt,

                negative_prompt:
                    "blurry, low quality, pixelated, distorted, deformed, ugly, bad anatomy, bad proportions, extra fingers, extra limbs, duplicate, cropped, watermark, text, logo, noisy",

                height: 1024,
                width: 1024,

                // Pixazo SDXL maximum = 20
                num_steps: 20,

                // Better prompt adherence
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

        console.log("PIXAZO RESPONSE:", response.data);

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

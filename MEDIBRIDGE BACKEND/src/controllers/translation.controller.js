const translationService = require("../services/translation.service");

const translateMessage = async (req, res) => {
  try {
    const { text, direction } = req.body;

    const translatedText =
      await translationService.translateMessage({
        text,
        direction,
      });

    return res.status(200).json({
      message: "Translation successful.",
      data: {
        originalText: text,
        translatedText,
        direction,
      },
    });
  } catch (error) {
    console.error("Translation error:", error);

    return res.status(400).json({
      message:
        error.message || "Unable to translate message.",
    });
  }
};

module.exports = {
  translateMessage,
};
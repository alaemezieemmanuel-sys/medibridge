/**
 * MEDIBRIDGE Local Translation Service
 *
 * This version does NOT use an external API.
 * It is designed for the hackathon MVP/demo.
 *
 * Supported directions:
 * - PIDGIN_TO_ENGLISH
 * - ENGLISH_TO_PIDGIN
 *
 * No API key or internet connection is required.
 */


const pidginToEnglish = [
  {
    pattern: /\bi get sore throat\b/gi,
    replacement: "I have a sore throat",
  },
  {
    pattern: /\bmy body dey heavy me\b/gi,
    replacement: "my body feels heavy",
  },
  {
    pattern: /\bbody dey heavy me\b/gi,
    replacement: "my body feels heavy",
  },
  {
    pattern: /\bhead dey pain me\b/gi,
    replacement: "I have a headache",
  },
  {
    pattern: /\bmy head dey pain me\b/gi,
    replacement: "my head hurts",
  },
  {
    pattern: /\bstomach dey pain me\b/gi,
    replacement: "I have stomach pain",
  },
  {
    pattern: /\bmy stomach dey pain me\b/gi,
    replacement: "my stomach hurts",
  },
  {
    pattern: /\bi dey cough\b/gi,
    replacement: "I am coughing",
  },
  {
    pattern: /\bi dey feel weak\b/gi,
    replacement: "I feel weak",
  },
  {
    pattern: /\bi dey dizzy\b/gi,
    replacement: "I feel dizzy",
  },
  {
    pattern: /\bi dey vomit\b/gi,
    replacement: "I am vomiting",
  },
  {
    pattern: /\bi no fit sleep\b/gi,
    replacement: "I cannot sleep",
  },
  {
    pattern: /\bi no dey feel well\b/gi,
    replacement: "I do not feel well",
  },
  {
    pattern: /\bi dey feel sick\b/gi,
    replacement: "I feel sick",
  },
  {
    pattern: /\bfever dey worry me\b/gi,
    replacement: "I have a fever",
  },
  {
    pattern: /\bmy body dey hot\b/gi,
    replacement: "my body feels hot",
  },
  {
    pattern: /\bi get fever\b/gi,
    replacement: "I have a fever",
  },
  {
    pattern: /\bi get headache\b/gi,
    replacement: "I have a headache",
  },
  {
    pattern: /\bi get stomach pain\b/gi,
    replacement: "I have stomach pain",
  },
  {
    pattern: /\bi wan\b/gi,
    replacement: "I want to",
  },
  {
    pattern: /\bi need make i\b/gi,
    replacement: "I need to",
  },
  {
    pattern: /\bmake i\b/gi,
    replacement: "let me",
  },
  {
    pattern: /\babeg\b/gi,
    replacement: "please",
  },
  {
    pattern: /\bdey\b/gi,
    replacement: "am",
  },
  {
    pattern: /\bno fit\b/gi,
    replacement: "cannot",
  },
  {
    pattern: /\bfit\b/gi,
    replacement: "can",
  },
  {
    pattern: /\bwey\b/gi,
    replacement: "that",
  },
  {
    pattern: /\bna\b/gi,
    replacement: "is",
  },
  {
    pattern: /\bdey worry me\b/gi,
    replacement: "is bothering me",
  },
];


const englishToPidgin = [
  {
    pattern: /\bI have a sore throat\b/gi,
    replacement: "I get sore throat",
  },
  {
    pattern: /\bmy body feels heavy\b/gi,
    replacement: "my body dey heavy me",
  },
  {
    pattern: /\bI have a headache\b/gi,
    replacement: "head dey pain me",
  },
  {
    pattern: /\bI have stomach pain\b/gi,
    replacement: "stomach dey pain me",
  },
  {
    pattern: /\bI am coughing\b/gi,
    replacement: "I dey cough",
  },
  {
    pattern: /\bI feel weak\b/gi,
    replacement: "I dey feel weak",
  },
  {
    pattern: /\bI feel dizzy\b/gi,
    replacement: "I dey dizzy",
  },
  {
    pattern: /\bI am vomiting\b/gi,
    replacement: "I dey vomit",
  },
  {
    pattern: /\bI cannot sleep\b/gi,
    replacement: "I no fit sleep",
  },
  {
    pattern: /\bI do not feel well\b/gi,
    replacement: "I no dey feel well",
  },
  {
    pattern: /\bI feel sick\b/gi,
    replacement: "I dey feel sick",
  },
  {
    pattern: /\bI have a fever\b/gi,
    replacement: "I get fever",
  },
  {
    pattern: /\bmy body feels hot\b/gi,
    replacement: "my body dey hot",
  },
  {
    pattern: /\bPlease get some rest\b/gi,
    replacement: "Abeg get some rest",
  },
  {
    pattern: /\bGet some rest\b/gi,
    replacement: "Get some rest",
  },
  {
    pattern: /\bGargle salt water\b/gi,
    replacement: "Use salt water wash your mouth",
  },
  {
    pattern: /\bdrink plenty of water\b/gi,
    replacement: "drink plenty water",
  },
  {
    pattern: /\btake your medication\b/gi,
    replacement: "take your medicine",
  },
  {
    pattern: /\btake your medicine\b/gi,
    replacement: "take your medicine",
  },
  {
    pattern: /\bcome back\b/gi,
    replacement: "come back",
  },
  {
    pattern: /\bif you feel worse\b/gi,
    replacement: "if you dey feel worse",
  },
  {
    pattern: /\bif the symptoms get worse\b/gi,
    replacement: "if the symptoms get worse",
  },
  {
    pattern: /\bHow are you feeling today\??/gi,
    replacement: "How you dey feel today?",
  },
  {
    pattern: /\bThank you for the update\b/gi,
    replacement: "Thank you for the update",
  },
];


/**
 * Apply translation rules to text.
 */
const applyRules = (text, rules) => {
  let result = text;

  for (const rule of rules) {
    result = result.replace(
      rule.pattern,
      rule.replacement
    );
  }

  return result;
};


/**
 * Clean up common grammatical issues after translation.
 */
const cleanTranslation = (text, direction) => {
  let result = text.trim();

  if (direction === "PIDGIN_TO_ENGLISH") {
    result = result.replace(/\s+/g, " ");

    if (
      result.length > 0 &&
      !/[.!?]$/.test(result)
    ) {
      result += ".";
    }
  }

  if (direction === "ENGLISH_TO_PIDGIN") {
    result = result.replace(/\s+/g, " ");

    if (
      result.length > 0 &&
      !/[.!?]$/.test(result)
    ) {
      result += ".";
    }
  }

  return result;
};


/**
 * Main translation function.
 */
const translateMessage = async ({
  text,
  direction,
}) => {
  if (!text || !text.trim()) {
    throw new Error("Text is required.");
  }

  if (
    ![
      "PIDGIN_TO_ENGLISH",
      "ENGLISH_TO_PIDGIN",
    ].includes(direction)
  ) {
    throw new Error(
      "Invalid translation direction."
    );
  }

  let translatedText;

  if (direction === "PIDGIN_TO_ENGLISH") {
    translatedText = applyRules(
      text.trim(),
      pidginToEnglish
    );
  } else {
    translatedText = applyRules(
      text.trim(),
      englishToPidgin
    );
  }

  translatedText = cleanTranslation(
    translatedText,
    direction
  );

  return translatedText;
};


module.exports = {
  translateMessage,
};
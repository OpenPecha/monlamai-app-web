const q1Options = [
  "news",
  "book",
  "conversation",
  "poem",
  "letter",
  "articles",
  "documents",
  "advertesment",
  "other",
];

// options to audio transcribe,
// conversations, news, teaching, movies, lyrics, other
const q2Options = [
  "conversations",
  "news",
  "teaching",
  "movies",
  "lyrics",
  "other",
];

//   options to read via tts,
// book, news, story, prayer, other
const q3Options = ["book", "news", "story", "prayer", "other"];

// options to ocr,
// wood block print, handwritten print, modern print, billboard, rock art, other
const q4Options = [
  "wood block print",
  "handwritten print",
  "modern print",
  "billboard",
  "rock art",
  "other",
];

export const feedback_options = {
  q1: {
    label: "ཁྱེད་ཀྱིས་ཡིག་སྒྱུར་ཅི་ཞིག་བྱེད་དམ།",
    option: q1Options,
  },
  q2: {
    label: "ཁྱེད་ཀྱིས་སྒྲ་གང་ཞིག་ཡིག་འབེབས་བྱེད་དམ།",
    option: q2Options,
  },
  q3: { label: "ཁྱེད་ཀྱིས་སྒྲ་གང་ཞིག་ཀློག་འདོན་བྱེད་དམ།", option: q3Options },
  q4: {
    label: "ཁྱེད་ཀྱིས་པར་རིས་གང་ཞིག་ཡིག་འབེབས་བྱེད་དམ།",
    option: q4Options,
  },
};
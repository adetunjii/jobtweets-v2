import { BayesClassifier } from "natural";

export const classifyWithBayes = (text: string, callback: Function) => {
  BayesClassifier.load(
    "classifier.json",
    null,
    function (err, classifier: BayesClassifier) {
      if (err) {
        console.error(err);
        callback(err, null);
      }

      text = removeHash(text);

      text = removeHash(text);
      const classifications: any[] = [];
      const result = classifier.getClassifications(text);

      classifications.push(result[0].label);
      classifications.push(result[1].label);

      callback(null, classifications);
    }
  );
};

const removeHash = (word: string): string => {
  return word.replace(/#|RT|rt/g, "");
};

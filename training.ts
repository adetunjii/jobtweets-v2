import { BayesClassifier } from "natural";
import { readFileSync } from "fs";
import { join } from "lodash";

const classifier = new BayesClassifier();

const train = () => {
  let data = readFileSync("training-data.json", "utf-8");
  let parsedData = JSON.parse(data);

  for (let i = 0; i < parsedData.length; i++) {
    let text = join(parsedData[i].keywords, ",");
    classifier.addDocument(text, parsedData[i].field);
  }
};

train();

classifier.train();

classifier.save("classifier.json", function (err, classifier) {
  if (err) throw err;
});

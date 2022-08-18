import { stdin, stdout } from 'node:process';
import readline from 'node:readline';
import colors from 'colors';

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red',
});

const numberRangeValidation = (result, item) => {
  'maxValue' in item && result > item.maxValue && (result = item.maxValue);
  'minValue' in item && result < item.minValue && (result = item.minValue);

  return result;
};

const typeConverter = {
  async boolean(val) {
    const result = String(val).toLowerCase();
    return result === 'y' || result === 'true';
  },
  async number(val, item) {
    let result = Number(val);
    while (result !== result) {
      result = Number(
        (await readUserInput('数値を入力してください: ')) || item.default
      );
    }
    result = numberRangeValidation(result, item);
    return result;
  },
  async string(val) {
    return val;
  },
};

const readUserInput = question => {
  const readlineInterface = readline.createInterface({
    input: stdin,
    output: stdout,
  });

  return new Promise(resolve => {
    readlineInterface.question(question, answer => {
      resolve(answer);
      readlineInterface.close();
    });
  });
};

export const dialog = async (settings, json) => {
  for (const item of json.item) {
    if (!item.preQuestion || settings[item.category][item.preQuestion]) {
      const answer =
        (await readUserInput(`${item.question}(default: ${item.default})? `)) ||
        item.default;
      const convertedAnswer = await typeConverter[item.type](answer, item);
      console.log(`${item.determined}${convertedAnswer}`.info);

      if (item.category) {
        settings[item.category][item.property] = convertedAnswer;
      } else {
        settings[item.property] = convertedAnswer;
      }
    }
  }
  console.log(settings);
  console.log('start!'.warn);
};


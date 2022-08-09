import { stdin as input, stdout as output } from 'node:process';
import * as readline from 'node:readline/promises';

export const inputPath = async () => {
  const rl = readline.createInterface({ input, output });

  const answer = await rl.question('folder path:');
  console.log(`target folder: ${answer}`);
  rl.close();
  return answer
};

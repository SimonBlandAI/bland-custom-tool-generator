import { UserInputCollector } from '../input/inputCollector';

async function main() {
  const inputCollector = new UserInputCollector();
  
  const questions = [
    "API Service Tool:",
    "Specfic Endpoint:", 
    "Required Params"
  ];

  const inputs: Record<string, string> = {};
  try {
    for (const question of questions) {
      const answer = await inputCollector.collect(question);
      const key = Object.keys(answer)[0];
      inputs[key] = answer[key];
    }
  } finally {
    inputCollector.close();
  }
}

main().catch(console.error);

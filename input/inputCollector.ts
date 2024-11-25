import * as readline from 'readline';

export class UserInputCollector {
  private rl: readline.Interface;

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async collect(prompt: string): Promise<Record<string, string>> {
    const inputs: Record<string, string> = {};
    const answer = await this.askQuestion(prompt);
    const key = prompt.replace(/[?:]/g, '').trim();
    inputs[key] = answer;
    return inputs;
  }

  private askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(`${question} `, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  public close(): void {
    if (this.rl) {
      this.rl.close();
    }
  }
}

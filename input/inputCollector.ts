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
    
    const questions = prompt.split('\n').filter(q => q.trim());

    for (const question of questions) {
      const answer = await this.askQuestion(question);
      const key = question.replace(/[?:]/g, '').trim();
      inputs[key] = answer;
    }

    this.rl.close();
    return inputs;
  }

  private askQuestion(question: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(`${question} `, (answer) => {
        resolve(answer.trim());
      });
    });
  }
}

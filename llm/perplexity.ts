import axios from 'axios';
import { ILLM } from '../interfaces/ILLM';

interface Generation {
  id: string;
  text: string;
  timestamp: Date;
  model: string;
}

interface HistoryItem {
  id: string;
  prompt: string;
  completion: string;
  timestamp: Date;
  model: string;
}

export class PerplexityLLM implements ILLM {
  private history: HistoryItem[];
  private generations: Generation[];
  private variables: Map<string, string>;
  private apiKey: string;
  private currentModel: string;

  constructor( model: string = 'codellama-34b-instruct') {
    this.history = [];
    this.generations = [];
    this.variables = new Map();
    this.apiKey = process.env.PERPLEXITY_API_KEY ?? "";
    this.currentModel = model;
  }

  async generate(prompt: string): Promise<string> {
    const updatedPrompt = this.updateVariables(prompt);
    const completion = await this.callPerplexityAPI(updatedPrompt);
    
    this.addToHistory(updatedPrompt, completion);
    this.addGeneration(completion);
    
    return completion;
  }

  private async callPerplexityAPI(prompt: string): Promise<string> {
    try {
      const response = await axios.post('https://api.perplexity.ai/chat/completions', {
        model: this.currentModel,
        messages: [{ role: 'user', content: prompt }],
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error calling Perplexity API:', error);
      throw error;
    }
  }

  setModel(model: string): void {
    this.currentModel = model;
  }

  private addToHistory(prompt: string, completion: string): void {
    const historyItem: HistoryItem = {
      id: this.generateId(),
      prompt,
      completion,
      timestamp: new Date(),
      model: this.currentModel
    };
    this.history.push(historyItem);
  }

  private addGeneration(text: string): void {
    const generation: Generation = {
      id: this.generateId(),
      text,
      timestamp: new Date(),
      model: this.currentModel
    };
    this.generations.push(generation);
  }

  setVariable(key: string, value: string): void {
    this.variables.set(key, value);
  }

  getVariable(key: string): string | undefined {
    return this.variables.get(key);
  }

  updateVariables(text: string): string {
    let updatedText = text;
    for (const [key, value] of this.variables.entries()) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      updatedText = updatedText.replace(regex, value);
    }
    return updatedText;
  }

  getHistory(): HistoryItem[] {
    return this.history;
  }

  getGenerations(): Generation[] {
    return this.generations;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export default PerplexityLLM;

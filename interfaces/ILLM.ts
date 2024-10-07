export interface ILLM {
    generate(prompt: string): Promise<string>;
    setModel(model: string): void;
    setVariable(key: string, value: string): void;
    getVariable(key: string): string | undefined;
    updateVariables(text: string): string;
    getHistory(): HistoryItem[];
    getGenerations(): Generation[];
  }
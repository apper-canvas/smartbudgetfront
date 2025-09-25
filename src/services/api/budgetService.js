import budgetData from "@/services/mockData/budgets.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class BudgetService {
  constructor() {
    this.budgets = [...budgetData];
  }

  async getAll() {
    await delay(300);
    return [...this.budgets];
  }

  async getById(id) {
    await delay(200);
    const budget = this.budgets.find(b => b.Id === id);
    if (!budget) {
      throw new Error("Budget not found");
    }
    return { ...budget };
  }

  async create(budgetData) {
    await delay(400);
    const maxId = this.budgets.length > 0 ? 
      Math.max(...this.budgets.map(b => b.Id)) : 0;
    
    const newBudget = {
      Id: maxId + 1,
      ...budgetData
    };
    
    this.budgets.push(newBudget);
    return { ...newBudget };
  }

  async update(id, updateData) {
    await delay(350);
    const index = this.budgets.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error("Budget not found");
    }
    
    this.budgets[index] = { ...this.budgets[index], ...updateData };
    return { ...this.budgets[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.budgets.findIndex(b => b.Id === id);
    if (index === -1) {
      throw new Error("Budget not found");
    }
    
    const deleted = this.budgets.splice(index, 1)[0];
    return { ...deleted };
  }
}

export const budgetService = new BudgetService();
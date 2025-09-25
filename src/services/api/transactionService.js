import transactionData from "@/services/mockData/transactions.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TransactionService {
  constructor() {
    this.transactions = [...transactionData];
  }

  async getAll() {
    await delay(300);
    return [...this.transactions];
  }

  async getById(id) {
    await delay(200);
    const transaction = this.transactions.find(t => t.Id === id);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    return { ...transaction };
  }

  async create(transactionData) {
    await delay(400);
    const maxId = this.transactions.length > 0 ? 
      Math.max(...this.transactions.map(t => t.Id)) : 0;
    
    const newTransaction = {
      Id: maxId + 1,
      ...transactionData
    };
    
    this.transactions.push(newTransaction);
    return { ...newTransaction };
  }

  async update(id, updateData) {
    await delay(350);
    const index = this.transactions.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Transaction not found");
    }
    
    this.transactions[index] = { ...this.transactions[index], ...updateData };
    return { ...this.transactions[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.transactions.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Transaction not found");
    }
    
    const deleted = this.transactions.splice(index, 1)[0];
    return { ...deleted };
  }
}

export const transactionService = new TransactionService();
import goalData from "@/services/mockData/goals.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GoalService {
  constructor() {
    this.goals = [...goalData];
  }

  async getAll() {
    await delay(300);
    return [...this.goals];
  }

  async getById(id) {
    await delay(200);
    const goal = this.goals.find(g => g.Id === id);
    if (!goal) {
      throw new Error("Goal not found");
    }
    return { ...goal };
  }

  async create(goalData) {
    await delay(400);
    const maxId = this.goals.length > 0 ? 
      Math.max(...this.goals.map(g => g.Id)) : 0;
    
    const newGoal = {
      Id: maxId + 1,
      ...goalData
    };
    
    this.goals.push(newGoal);
    return { ...newGoal };
  }

  async update(id, updateData) {
    await delay(350);
    const index = this.goals.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Goal not found");
    }
    
    this.goals[index] = { ...this.goals[index], ...updateData };
    return { ...this.goals[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.goals.findIndex(g => g.Id === id);
    if (index === -1) {
      throw new Error("Goal not found");
    }
    
    const deleted = this.goals.splice(index, 1)[0];
    return { ...deleted };
  }
}

export const goalService = new GoalService();
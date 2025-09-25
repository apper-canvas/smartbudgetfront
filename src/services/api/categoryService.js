import categoryData from "@/services/mockData/categories.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CategoryService {
  constructor() {
    this.categories = [...categoryData];
  }

  async getAll() {
    await delay(200);
    return [...this.categories];
  }

  async getById(id) {
    await delay(150);
    const category = this.categories.find(c => c.Id === id);
    if (!category) {
      throw new Error("Category not found");
    }
    return { ...category };
  }

  async create(categoryData) {
    await delay(300);
    const maxId = this.categories.length > 0 ? 
      Math.max(...this.categories.map(c => c.Id)) : 0;
    
    const newCategory = {
      Id: maxId + 1,
      ...categoryData
    };
    
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updateData) {
    await delay(250);
    const index = this.categories.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    this.categories[index] = { ...this.categories[index], ...updateData };
    return { ...this.categories[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.categories.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Category not found");
    }
    
    const deleted = this.categories.splice(index, 1)[0];
    return { ...deleted };
  }
}

export const categoryService = new CategoryService();
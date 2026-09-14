import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialSeedData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

class Database {
  constructor() {
    this.data = {};
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.reset();
      } else {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure required collections exist
        if (!this.data.students || !this.data.attendanceRecords) {
          this.reset();
        }
      }
    } catch (err) {
      console.error('Error initializing DB, resetting to seed data:', err);
      this.reset();
    }
  }

  save() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error saving DB:', err);
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(initialSeedData));
    this.save();
    console.log('Database initialized with seed data.');
  }

  get(collection) {
    return this.data[collection] || [];
  }

  findById(collection, id) {
    const list = this.get(collection);
    return list.find(item => String(item.id) === String(id));
  }

  find(collection, predicate) {
    const list = this.get(collection);
    return list.filter(predicate);
  }

  insert(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    const newItem = {
      ...item,
      id: item.id || `item_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: item.createdAt || new Date().toISOString()
    };
    this.data[collection].push(newItem);
    this.save();
    return newItem;
  }

  update(collection, id, updates) {
    const list = this.get(collection);
    const index = list.findIndex(item => String(item.id) === String(id));
    if (index === -1) return null;
    const updated = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    list[index] = updated;
    this.save();
    return updated;
  }

  delete(collection, id) {
    const list = this.get(collection);
    const index = list.findIndex(item => String(item.id) === String(id));
    if (index === -1) return false;
    list.splice(index, 1);
    this.save();
    return true;
  }

  set(collection, items) {
    this.data[collection] = items;
    this.save();
    return items;
  }
}

export const db = new Database();

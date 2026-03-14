//
//  SeedHabitsRepository.js
//  
//
//  Created by Emmanuel Babalola on 3/8/26.
//

import { HABITS_SEED } from "./habits.seed";

export default class SeedHabitsRepository {
  async listAll() {
    return HABITS_SEED;
  }

  async getById(id) {
    return HABITS_SEED.find((h) => h.id === id) || null;
  }
}

//
//  UpdatePrefsUseCase.js
//  
//
//  Created by Emmanuel Babalola on 3/27/26.
//

export default class UpdatePrefsUseCase {
  constructor({ prefsRepo }) {
    this.prefsRepo = prefsRepo;
  }

  async execute(partialPrefs) {
    return await this.prefsRepo.update(partialPrefs);
  }
}

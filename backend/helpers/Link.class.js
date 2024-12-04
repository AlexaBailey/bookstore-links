import { readTxtFileAsJson } from "../helpers/convert.js";

class Link {
  constructor(link) {
    const match = link.match(/^\$\{([^/]+)\/(\d+)\/([^}]+)\}$/);
    if (!match) {
      throw new Error(`Invalid link format: ${link}`);
    }
    const [, tableName, rowNumber] = match;
    this.tableName = tableName;
    this.rowNumber = parseInt(rowNumber, 10);
  }

  async resolveLink() {
    const entities = await readTxtFileAsJson(`${this.tableName}.txt`);

    const rowIndex = this.rowNumber - 1;
    if (rowIndex < 0 || rowIndex >= entities.length) {
      throw new Error(
        `Row number ${this.rowNumber} out of bounds for table ${this.tableName}`
      );
    }

    return entities[rowIndex];
  }

  static async resolveById(tableName, id) {
    const entities = await readTxtFileAsJson(`${tableName}.txt`);
    const entity = entities.find((entry) => entry.id == id);

    if (!entity) {
      throw new Error(`No entity with id ${id} found in table ${tableName}`);
    }

    return entity;
  }

  static async formatLinkById(tableName, id) {
    const entities = await readTxtFileAsJson(`${tableName}.txt`);
    const rowIndex = entities.findIndex((entry) => entry.id == id);

    if (rowIndex === -1) {
      throw new Error(`No entity with id ${id} found in table ${tableName}`);
    }

    const rowNumber = rowIndex + 1;
    return `\${${tableName}/${rowNumber}/id}`;
  }
}

export default Link;

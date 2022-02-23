import { ANSI_ESCAPES } from "../../types";

export function logJson(input: any): void {
  return (() =>
    console.log(
      `${ANSI_ESCAPES.warning}`,
      `${JSON.stringify(input, null, 2)}`,
      `${ANSI_ESCAPES.reset}`
    ))();
}

/**
 * helper class to construct colored console logs for the tests
 */
export class ColorLog extends Object {
  private color!: string;
  private message!: string;
  constructor(color: string, message: string) {
    super();
    this.message = message;
    switch (color) {
      case "yellow":
        {
          this.color = ANSI_ESCAPES.warning;
        }
        break;
      case "red":
        {
          this.color = ANSI_ESCAPES.danger;
        }
        break;
      case "green":
        {
          this.color = ANSI_ESCAPES.success;
        }
        break;
      case "blue":
        {
          this.color = ANSI_ESCAPES.info;
        }
        break;
      case "purple":
        {
          this.color = ANSI_ESCAPES.link;
        }
        break;
      default:
        this.color = "";
    }
  }
  public genLog(): void {
    return console.log(`${this.color}`, `${this.message}`, `${ANSI_ESCAPES.reset}`);
  }
}

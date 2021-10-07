/**
 * ansi escape code enum collection for printing any color text into the console as the first/third argument of a console.log()
 * @example
 * console.log(`${red || "\x1b[31m"}`, "red text in the log", `${reset || "\x1b[00m"}`)
 */
export enum ANSI_ESCAPES {
  danger = "\x1b[31m",
  success = "\x1b[32m",
  info = "\x1b[36m",
  warning = "\x1b[33m",
  link = "\x1b[35m",
  danger_back = "\x1b[41m",
  success_back = "\x1b[42m",
  warning_back = "\x1b[43m",
  info_back = "\x1b[44m",
  link_back = "\x1b[45m",
  reset = "\x1b[00m",
}

export interface MeQueryResponse extends Object {
  errors:
    | null
    | [
        {
          field: string;
          message: string;
        }
      ];
  token: string;
  me: {
    token: string;
    username: string;
    email: string;
  };
}

export interface ConstantCliArgs extends Object {
  varName?: string | undefined;
  type?: string | undefined;
  value?: string | undefined;
  description?: string | undefined;
}

export interface IkeyValueMappedObj {
  fileName?: KeyValueMappedObj["fileName"];
  jsonMainProp?: KeyValueMappedObj["jsonMainProp"];
  obj: KeyValueMappedObj["obj"];
}

export type KeyValueMappedObj = KeyValueMappedObjClass;
export class KeyValueMappedObjClass extends Object {
  // eslint-disable-next-line
  obj!: Record<string, any>; //keyvalue store of the form props that we want to create a fixture for
  fileName!: string | undefined;
  jsonMainProp!: string | undefined;
  //take input into the constructor function from the cli args and arrange them in a way to make a row of json
  constructor(
    inputName: string | undefined,
    jsonMainPropInput: string | undefined,
    keyValueArgs: Array<string> | []
  ) {
    //inherit all methods and properties of a javascript object with super();
    super();

    this.fileName = inputName || undefined;
    this.jsonMainProp = jsonMainPropInput;
    this.obj = {};

    /**
     * instantiate this object instance with a key value store of the keyValueArgs passed into the constructor
     * iterate through the keyValueArgs to assign
     */
    // if the index of the cli input args array is odd then it is the value
    // if index is even then it is the key
    let currentKey: string | undefined = undefined;
    console.log(
      `${ANSI_ESCAPES.danger}`,
      `making ts compiler happy....current key is initialized as ${typeof currentKey}`,
      `${ANSI_ESCAPES.reset}`
    );

    let previousKey = "";
    let currentValue = "";
    // eslint-disable-next-line
    let tmpObj: any = {};
    for (let i = 0; i < keyValueArgs.length; i++) {
      tmpObj = {};
      currentKey = "";
      //set the previous key if we moved past index 0 since 0 - 1 is out of bounds!
      i > 0 ? (previousKey = keyValueArgs[i - 1]) : (previousKey = "");
      currentValue = "";
      //if we are on index zero

      if (i % 2 === 0) {
        //if the index iterator is an even number since we started the argv array with the key name input arg
        // then place that key name string as the first property of this.obj class nested obj
        currentKey = keyValueArgs[i];
        tmpObj[keyValueArgs[i]] = "";
        this.obj = {
          ...this.obj,
          ...tmpObj,
        };
      }
      if (i % 2 === 1) {
        //if the index iterator is an odd number then it is a value input arg => set it to the previously spread tmpObj key property name that was set null
        // now we set that property from null to the string value of the arg input
        currentValue = keyValueArgs[i];
        tmpObj[previousKey] = currentValue;
        this.obj = {
          ...this.obj,
          ...tmpObj,
        };
      }
    }
  }
  /**
   *
   * @returns string array of all the keys on this.obj key value store.
   */
  public getObjKeys(): Array<string> {
    return Object.keys(this.obj);
  }
  /**
   *
   * @returns `string[]` if there are values enumerated on any this.obj keys otherwise return `undefined`
   */
  public getObjKeyValues(): Array<string> | undefined {
    if (this.getObjKeys().length <= 0) return undefined;
    return Object.values(this.obj);
  }

  /**
   * helper to return a specific key easily from the nested object
   * @param input string input to get a specific key of the nested plastic object that has dynamic props from input args
   * @returns property key name string
   */
  public getInstanceKey(input: string): string {
    let key = "";
    let arr: Array<string> = [];
    arr = Object.keys(this).filter((key) => key === input);
    key = arr[0];
    return key;
  }
}

export interface IMissingArgs {
  fileName?: string | false;
  jsonMainProp: string | false;
  restOfArgs: boolean;
}

export type IPreJsonObj = PreJsonObjClass;
export class PreJsonObjClass {
  constructor(jsonMainPropString: string, inputObj: Record<string, unknown>) {
    Object.assign(this, {
      ...this,
      [jsonMainPropString]: inputObj,
    });
  }
}
export type LightTextName =
  | ""
  | "light-danger-back"
  | "light-success-back"
  | "light-warning-back"
  | "light-info-back"
  | "light-link-back"
  | "light-primary-back";
export type TextColor =
  | "danger"
  | "success"
  | "warning"
  | "info"
  | "link"
  | "primary"
  | "";

export type BackgroundColor =
  | ""
  | "danger-back"
  | "success-back"
  | "warning-back"
  | "info-back"
  | "link-back"
  | "primary-back"
  | "white-back";
export type LightBackGroundName =
  | ""
  | "light-danger-text"
  | "light-success-text"
  | "light-warning-text"
  | "light-info-text"
  | "light-link-text"
  | "light-primary-text"
  | "white-text";

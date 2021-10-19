export interface ICard {
  __typename?: "Card";
  // eslint-disable-next-line
  id?: number | undefined;
  cardId?: number | string;
  creatorId?: number | string;
  frontSideText?: string;
  frontSideLanguage?: string;
  frontSidePicture?: string;
  backSideText?: string;
  backSideLanguage?: string;
  backSidePicture?: string;
  updatedAt?: number | string;
  createdAt?: number | string;
  categorized?: { [key: string]: ICard[] };
  uncategorized?: Array<ICard>;
  color?: string | "blue"; //TODO remove
}
export interface SetCategorizedCardsCommitPayload {
  categorized: Map<number, string>;
}
export interface SetCategorizedCardsActionPayload {
  cards: Array<ICard>;
}

export type LanguageSymbol = "frontSideLanguage";

export type LiteralLanguageSymbol = `${LanguageSymbol}`;

export class CategorizedCardMapClass extends Map {
  private categorizedMap!: Map<ICard["id"], string>;
  constructor() {
    super();
    this.categorizedMap = new Map();
    // this.categorizedMap = this.setSelf(key as number, value as string);
  }
  public clearSelf(): void {
    Object.keys(this.categorizedMap).map((key) => {
      delete this.categorizedMap[key];
    });
  }
  public printMe(): void {
    console.log(this.categorizedMap);
  }
}

export interface EditCardResponse {
  editCardById: {
    errors: MyErrorResponse;
    cards?: null | ICard[];
  };
}
export interface Modal {
  context: {
    card: ICard | Record<string, never>;
  };
  activeClass: boolean;
  title: string;
}

export interface AddCardCommitPayload {
  cardId?: number;
  frontSideText: string;
  frontSideLanguage: string;
  frontSidePicture: string;
  backSideText: string;
  backSideLanguage: string;
  backSidePicture: string;
  color?: string;
  id?: number;
}
export interface EditCardCommitPayload {
  id: number | string | undefined;
  cardId?: number;
  frontSideText: string;
  frontSideLanguage: string;
  frontSidePicture: string;
  backSideText: string;
  backSideLanguage: string;
  backSidePicture: string;
  color?: string;
}
export interface EditCardModalContext {
  card: ICard;
}
export interface ModalState {
  modal: Modal;
}
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

//for some reason this interface for the event didn't export for whatever reason....strange...oh well it
// only applies to the cardlist component anyways
export interface MyDOMInputEvent extends Event {
  target: EventTarget & {
    //for some reason value isn't a property on the vanilla EventTarget type given by typescript....
    // so we are forcing it to be a property
    value: number | string;
  };
}
export interface MeQueryResponse extends Object {
  me: {
    user: UserEntityBase;
    errors: MyErrorResponse;
    cards: ICard[];
  };
}
export interface GetUserCardsResponse {
  getUserCards: {
    cards: ICard[];
    errors: MyErrorResponse;
  };
}

export interface LoadingState {
  loading: {
    isLoading: boolean;
  };
}
export interface MyRootState {
  user: UserState;
  loading: LoadingState;
  card: CardState;
  cards: CardsState;
  modal: ModalState;
  notification: NotificationState;
}
export interface UserState {
  user: {
    username: string | null;
    email: string | null;
    token?: string | null | undefined;
    cards: ICard[];
    loggedIn: boolean;
    __typename?: string;
    id?: number;
    createdAt?: number;
    updatedAt?: number;
  };
}

export interface SetUserCommitPayload {
  username: string | null;
  email: string | null;
  token?: string | null | undefined;
  cards: ICard[];
  loggedIn: boolean;
  __typename?: string;
  id?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface UserEntityBase {
  __typename?: string;
  id?: number;
  username: string;
  email: string;
  token: string | null;
  createdAt: number;
  updatedAt: number;
}
export interface CardsState {
  cards: Array<ICard>;
  categorized?: CategorizedCardsObject; //class of categorized
  uncategorized?: Array<ICard>;
}
export interface CategorizedCardsObject {
  [key: string]: {
    cards: ICard[];
  };
}

export interface CardState {
  card: {
    id?: string | number;
    isFrontSide: boolean;
    isBackSide: boolean;
  };
}

export type RootDispatchType =
  | "user/setUserToken"
  | "user/setUserCards"
  | "user/setUser"
  | "cards/setCards"
  | "cards/deleteCard"
  | "cards/editCard"
  | "cards/addCard"
  | "cards/setCategorizedCards";

export interface AddCardPayload {
  options: {
    frontSideText: string | undefined;
    frontSideLanguage: string | undefined;
    frontSidePicture: string | undefined;
    backSideText: string | undefined;
    backSideLanguage: string | undefined;
    backSidePicture: string | undefined;
  };
}
export interface AddCardResponse {
  addCard: {
    cards: ICard[];
    errors: MyErrorResponse;
  };
}

export type RootCommitType =
  | "user/SET_USER"
  | "user/CLEAR_USER_TOKEN"
  | "user/SET_LOGGED_IN"
  | "user/SET_USER_CARDS"
  | "cards/ADD_CARD"
  | "cards/SET_CARDS"
  | "cards/DELETE_CARD"
  | "cards/EDIT_CARD"
  | "modal/SET_MODAL_ACTIVE"
  | "modal/SET_MODAL_CONTEXT"
  | "notification/OPEN_NOTIFICATION"
  | "notification/CLOSE_NOTIFICATION"
  | "loading/SET_LOADING"
  | "card/CARD_SIDE_FRONT"
  | "card/CARD_SIDE_BACK"
  | "cards/SET_CATEGORIZED_CARD_MAP";

export interface CardBackPayload {
  isFrontSide: false;
  isBackSide: true;
}
export interface CardFrontPayload {
  isFrontSide: true;
  isBackSide: false;
}

export interface CustomError {
  field: string;
  message: string;
}
export type MyErrorResponse = CustomError[] | null;

export interface RegisterResponse {
  register: {
    errors: MyErrorResponse;
    token: string | null;
    user: UserEntityBase | null;
  };
}
export interface LoginResponse {
  login: {
    errors: MyErrorResponse;
    token: string | null;
    user: UserEntityBase | null;
  };
}

export interface NotificationState {
  notification: {
    type: "error" | "success" | "";
    message: string;
    toastDown: boolean;
    toastUp: boolean;
  };
}

export interface OpenNotificationPayload {
  notification: {
    type: "error" | "success";
    message: string;
    toastDown: true;
    toastUp: false;
  };
}

export interface ForgotPassResponse {
  forgotPassword: {
    done: boolean | null;
    errors?: MyErrorResponse | null;
  };
}

export interface ChangePasswordResponse {
  changePassword: {
    done: boolean | null;
    token: string | null;
    cards: ICard[];
    errors?: MyErrorResponse | null;
  };
}

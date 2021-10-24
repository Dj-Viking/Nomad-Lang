export interface ICard {
  __typename?: "Card";
  // eslint-disable-next-line
  id?: number;
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
  isFrontSide?: boolean;
  isBackSide?: boolean;
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

export interface DeleteCardResponse {
  deleteCard: {
    errors: MyErrorResponse;
    cards: ICard[];
  };
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

export interface SidebarState {
  sidebar: {
    isOpen: boolean;
  };
}

export interface MyRootState {
  user: UserState;
  loading: LoadingState;
  sideBarCategories: SidebarCategorizedCardsState;
  card: CardState;
  sidebar: SidebarState;
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
  allCards: Array<ICard>;
  cards: Array<ICard>;
  categorized: CategorizedCardsObject; //class of categorized
  uncategorized?: Array<ICard>;
}

export interface CategorizedCardsObject {
  [key: string]: {
    id?: string;
    cards: ICard[];
    isActive: boolean;
  };
}
export interface SidebarCategorizedCardsState {
  categories: {
    [key: string]: {
      id: string;
      isActive: boolean;
      cards: ICard[];
    };
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
  /** */
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
  /** */
  | "cards/ADD_CARD"
  | "cards/SET_ALL_CARDS"
  | "cards/SET_DISPLAY_CARDS"
  | "cards/DELETE_CARD"
  | "cards/EDIT_CARD"
  | "cards/SET_CATEGORIZED_CARD_MAP"
  | "cards/TOGGLE_CARD_SIDE"
  /** */
  | "modal/SET_MODAL_ACTIVE"
  | "modal/SET_MODAL_CONTEXT"
  /** */
  | "notification/OPEN_NOTIFICATION"
  | "notification/CLOSE_NOTIFICATION"
  /** */
  | "loading/SET_LOADING"
  /** */
  | "sidebarCategories/INIT_SIDEBAR_CATEGORIES"
  | "sidebarCategories/TOGGLE_ONE_SIDECATEG_ACTIVE"
  | "sidebar/TOGGLE_SIDEBAR";

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
    cards: ICard[];
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

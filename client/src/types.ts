export interface ICard {
  _id: string;
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
}

export class CardClass implements ICard {
  _id = "";
  creatorId?: string | number | undefined;
  frontSideText?: string | undefined;
  frontSideLanguage?: string | undefined;
  frontSidePicture?: string | undefined;
  backSideLanguage?: string | undefined;
  backSidePicture?: string | undefined;
  backSideText?: string | undefined;
  updatedAt?: string | number | undefined;
  createdAt?: string | number | undefined;
  isFrontSide?: boolean | undefined;
  isBackSide?: boolean | undefined;
  categorized?: { [key: string]: ICard[]; } | undefined;
  uncategorized?: ICard[] | undefined;
}

export type ThemePrefChangeResponse = {
  themePref?: string;
} & {
  error?: unknown;
};
export type DeleteCardResponse = {
  cards?: ICard[] | null;
} & {
  error?: unknown | null;
};

export type EditCardResponse = {
  cards?: ICard[] | null;
} & {
  error?: unknown | null;
};
export interface Modal {
  context: {
    card: CardClass;
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
export type MeQueryResponse = {
  user?: UserEntityBase;
} & {
  error?: string;
};
export type GetUserCardsResponse = {
  cards: ICard[];
} & {
  error: string;
};

export interface LoadingState {
  loading: {
    isLoading: boolean;
  };
}

export interface SidebarState {
  sidebar: {
    searchTerm: string;
    isOpen: boolean;
  };
}
export interface ThemeState {
  theme: string;
}
export interface MyRootState {
  user: UserState;
  theme: ThemeState;
  loading: LoadingState;
  sideBarCategories: SidebarCategorizedCardsState;
  card: CardState;
  sidebar: SidebarState;
  cards: CardsState;
  modal: ModalState;
}
export interface UserState {
  user: {
    username: string | null;
    score: number;
    answers: { correct: number; incorrect: number; };
    email: string | null;
    token?: string | null | undefined;
    cards: ICard[];
    loggedIn: boolean;
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
  id?: number;
  createdAt?: number;
  updatedAt?: number;
}

export interface UserEntityBase {
  _id: string;
  username: string;
  themePref: string;
  email: string;
  token: string | null;
  cards: Array<ICard>;
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
  | "sidebarCategories/toggleWithOneKey"
  /** */
  | "cards/setCards"
  | "cards/deleteCard"
  | "cards/editCard"
  | "cards/addCard"
  | "cards/shiftCardNext"
  | "cards/setCategorizedCards";

export interface AddCardPayload {
  frontSideText?: string;
  frontSideLanguage?: string;
  frontSidePicture?: string;
  backSideText?: string;
  backSideLanguage?: string;
  backSidePicture?: string;
}
export type AddCardResponse = {
  cards?: ICard[];
} & {
  error?: unknown;
};

export type MyGetters =
  | "sidebarCategories/aCategoryIsActive"
  | "sidebarCategories/currentActiveCategoryCards"
  | "user/correct"
  | "user/incorrect"

export type RootCommitType =
  | "user/SET_USER"
  | "user/CLEAR_USER_TOKEN"
  | "user/SET_LOGGED_IN"
  | "user/INCREMENT_CORRECT"
  | "user/INCREMENT_INCORRECT"
  | "user/SAVE_SCORE"
  | "user/RESET_ANSWERS"
  /** */
  | "theme/TOGGLE_THEME"
  | "theme/SET_THEME"
  /** */
  | "cards/ADD_CARD"
  | "cards/SET_ALL_CARDS"
  | "cards/SET_DISPLAY_CARDS"
  | "cards/DELETE_CARD"
  | "cards/EDIT_CARD"
  | "cards/SET_CATEGORIZED_CARD_MAP"
  | "cards/TOGGLE_CARD_SIDE"
  | "cards/SHIFT_CARD_NEXT"
  /** */
  | "modal/SET_MODAL_ACTIVE"
  | "modal/SET_MODAL_TITLE"
  | "modal/SET_MODAL_CONTEXT"
  /** */
  | "notification/OPEN_NOTIFICATION"
  | "notification/CLOSE_NOTIFICATION"
  /** */
  | "loading/SET_LOADING"
  /** */
  | "sidebarCategories/INIT_SIDEBAR_CATEGORIES"
  | "sidebarCategories/TOGGLE_ONE_SIDECATEG_ACTIVE"
  | "sidebarCategories/TOGGLE_WITH_ONE_KEY"
  /** */
  | "sidebar/SET_SEARCH_TERM"
  | "sidebar/TOGGLE_SIDEBAR";

export interface CardBackPayload {
  isFrontSide: false;
  isBackSide: true;
}
export interface CardFrontPayload {
  isFrontSide: true;
  isBackSide: false;
}

export type RegisterResponse = {
  user?: UserEntityBase | null;
} & {
  error?: unknown | undefined;
};

export type LoginResponse = {
  user?: UserEntityBase | null;
} & {
  error?: unknown | undefined;
};

export type ForgotPassResponse = {
  done?: boolean | null;
} & {
  error?: string;
};

export type ChangePasswordResponse = {
  done?: boolean | null;
  token?: string | null;
  cards?: ICard[] | null;
} & {
  error: string;
};

export interface IAddCardPayload {
  frontSideText?: string;
  frontSideLanguage?: string;
  frontSidePicture?: string;
  backSideText?: string;
  backSideLanguage?: string;
  backSidePicture?: string;
}
export type ClearCardsResponse = {
  user?: UserEntityBase | null;
} & {
  error?: unknown | null;
};
export interface IEditCardPayload {
  id: string;
  frontSideText?: string;
  frontSideLanguage?: string;
  frontSidePicture?: string;
  backSideText?: string;
  backSideLanguage?: string;
  backSidePicture?: string;
}

export type ChangeThemePrefResponse = {
  themePref?: string | null;
} & {
  error?: unknown | null;
};

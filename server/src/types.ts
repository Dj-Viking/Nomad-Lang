import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
// & sign in typescript joins types together (intersection)
// | sign in typescript gives the option for the type to be either one type or another (union)

//performing an interesection so we can make req.session.userId 
//req.session.welcomeBackMsg and req.session.username available to be assigned
// new values on the req.session object
export type MyContext = {
    req: Request & {
        user: MyJwtData | null;
        // session: Session & Partial<SessionData> & {
        //     userId?: number;
        // } & {
        //     welcomeBackMsg?: String;
        // } & {
        //     username?: String;
        // }
    };
    res: Response;
    next: NextFunction;
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
export interface RegisterResponse {
    register: {
        errors: MyErrorResponse
        token: string
        user: UserEntityBase
    }
}
export interface RegisterErrorResponse {
    register: {
        errors: MyErrorResponse
        user: null;
    }
}

export interface LoginInput {
    options: {
        username: string | "";
        email: string | "";
        password: string;

    }
}
export interface LoginResponse {
    login: {
        errors: MyErrorResponse
        user: UserEntityBase
        token: string;
    }
}
export interface LogoutResponse {
    logout: {
        errors: MyErrorResponse
        done: boolean | null
    };
}

export type MyJwtData = IJwtData;

export interface IJwtData extends jwt.JwtPayload {
    username: string;
    email: string;
    uuid?: string;
    resetEmail?: string;
    iat?: number;
    exp?: number;
}

export interface CustomError {
    field: string;
    message: string;
}
export type MyErrorResponse = CustomError[];

export interface AddCardResponse {
    addCard: {
        cards: null | ICard[]
        errors: MyErrorResponse
    }
}

export interface GetUserCardsResponse {
    getUserCards: {
        cards?: ICard[];
        errors: MyErrorResponse
    }
}

export interface ICard {
    id: number,
    frontSideText: string;
    frontSideLanguage: string;
    frontSidePicture: string;
    backSideText: string;
    backSideLanguage: string;
    backSidePicture: string;
    createdAt: string;
    updatedAt: string;
    creatorId: number;

}

export interface ClearUserCardsResponse {
    clearUserCards: {
        done: boolean | null;
        errors: MyErrorResponse
    }
}

export interface EditCardByIdResponse {
    editCardById: {
        errors: MyErrorResponse
        cards?: null | ICard[]
    }
}

export interface EditCardPayload {
    options: {
        frontSideText: string | undefined;
        frontSideLanguage: string | undefined;
        frontSidePicture: string | undefined;
        backSideText: string | undefined;
        backSideLanguage: string | undefined;
        backSidePicture: string | undefined;
        id: number | undefined;
    }
}
export interface AddCardPayload {
    options: {
        frontSideText: string | undefined;
        frontSideLanguage: string | undefined;
        frontSidePicture: string | undefined;
        backSideText: string | undefined;
        backSideLanguage: string | undefined;
        backSidePicture: string | undefined;
    }
}

export interface UserEntityBase {
    id: number;
    username: string;
    email: string;
    token: string | null;
    createdAt: number;
    updatedAt: number;
}

export interface MeQueryResponse {
    me: {
        user: {
            token: string;
            username: string;
            email: string;
        };
        token: string;
        cards: Array<ICard>;
        errors: MyErrorResponse;
    };
}

/**
 *  @example
 * const testEmailArgs: MySendEmailOptions = {
     fromHeader: "Server Start Test",
     subject: "this is a test", 
     mailTo: NODEMAILER_EMAIL_TO as string,
     mailHtml: "<h1>heres a test</h1>"
   }
 */
export interface MySendEmailOptions {
    mailTo: string;
    mailHtml: string;
    fromHeader?: string;
    subject?: string;
}

export interface SignResetPasswordTokenArgs {
    resetEmail: string;
    uuid: string;
    exp: string;
}

export interface SignLoginRegisterMeTokenArgs {
    username: string;
    email: string;
    uuid?: string;
}

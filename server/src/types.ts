import { NextFunction, Request, Response } from "express";
import mongoose, { ObjectId } from "mongoose";
// import { GraphQLScalarType, Kind } from 'graphql';
import jwt from "jsonwebtoken";
import { CardClass, ChoiceClass } from "./models";
// & sign in typescript joins types together (intersection)
// | sign in typescript gives the option for the type to be either one type or another (union)

export type Card = ICard | CardClass;

export type MyContext = {
    req: Request & { user: MyJwtData | null };
    res: Response;
    next: NextFunction;
};
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
export interface CategorizedCardMap {
    categorized: {
        [key: string]: Card[];
    };
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
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            readonly NODE_ENV: "development" | "production" | "test";
            readonly PORT?: string;
            EXPIRED_TOKEN?: string;
            INVALID_SIGNATURE?: string;
            SECRET?: string;
            EXPIRATION?: string;
            SUPER_SECRET?: string;
            ENV_TXT?: string;
            TEST_ADMIN_ENDPOINT?: string;
        }
    }
}
//declaration merging with express request
export namespace Express {
    export type MyRequest = Request & {
        user?: MyJwtData | null;
    };
}

export type MyJwtData = IJwtData;
export interface IJwtData extends jwt.JwtPayload {
    _id?: string;
    username: string;
    email: string;
    uuid?: string;
    adminUuid?: string;
    role?: "user" | "admin";
    resetEmail?: string;
    iat?: number;
    exp?: number;
}

export interface ICreateUserPayload {
    username: string;
    email: string;
    password: string;
}
export interface IUserCreateCardResponse {
    cards: Card[];
}
export interface IUserEditCardResponse {
    cards: Card[];
}
export interface IUserDeleteCardResponse {
    cards: Card[];
}

export interface SignLoginRegisterMeTokenArgs {
    _id?: string;
    username: string;
    email: string;
    role?: string;
    uuid?: string;
}
export interface SignResetPasswordTokenArgs {
    resetEmail: string;
    uuid: string;
    exp: string;
}
export interface AdminTokenArgs {
    adminUuid: string;
}

export interface ICreateCardPayload extends Object {
    frontsideText: string;
    frontsideLanguage: string;
    frontsidePicture: string;
    backsideText: string;
    backsideLanguage: string;
    backsidePicture: string;
}

export interface IMeResponse {
    user: {
        username: string;
        email: string;
        _id: string | ObjectId | unknown;
        role: string;
        cards: Card[];
        themePref: string;
        token: string;
        createdAt: Date | string | number;
        updatedAt: Date | string | number;
    };
}
export interface ICreateUserResponse {
    username: string;
    email: string;
    _id: string | ObjectId;
    role: string;
    cards: Card[];
    themePref?: string;
    token?: string;
    createdAt: Date | string | number;
    updatedAt: Date | string | number;
}

export interface ILoginError {
    error: string;
}
export interface ILoginResponse {
    username: string;
    email: string;
    _id: string;
    role: string;
    cards: Card[];
    token?: string;
    createdAt: Date | string | number;
    updatedAt: Date | string | number;
}

export interface ICard {
    _id: string | mongoose.Types.ObjectId | any;
    choices: ChoiceClass[];
    frontSideText?: string;
    frontSideLanguage?: string;
    frontSidePicture?: string;
    backSideText?: string;
    backSideLanguage?: string;
    backSidePicture?: string;
    creator?: string;
    createdAt: Date | string | number;
    updatedAt: Date | string | number;
}

export interface IUser {
    _id: string;
    cards: Card[];
    email: string;
    role?: string;
    updatedAt: Date | string | number;
    themePref?: string;
    createdAt: Date | string | number;
    token: string;
    username: string;
}

export interface IUpdateUser {
    username?: string;
    email?: string;
    cards: Card[];
    _id: string;
    role?: string;
}
export interface IUpdateUserObject {
    username?: string;
    email?: string;
    role?: string;
}
export interface IUpdateUserResponse {
    username: string;
    email: string;
    _id: string;
    cards: Card[];
    createdAt: Date | string | number;
    updatedAt: Date | string | number;
}

export interface IForgotPassResponse {
    done?: boolean;
    error?: string;
}

export interface IChangeThemeResponse {
    themePref: string;
}

export type IUserAddChoicesResponse = {
    result: boolean | null;
} & {
    err: unknown | null;
};

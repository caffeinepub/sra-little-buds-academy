import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Inquiry {
    name: string;
    message: string;
    timestamp: Time;
    phone: string;
}
export type Time = bigint;
export interface LoginResult {
    success: boolean;
    name: string;
}
export interface backendInterface {
    clearAllInquiries(): Promise<void>;
    clearAllUsers(): Promise<void>;
    getAllInquiries(): Promise<Array<Inquiry>>;
    submitInquiry(name: string, phone: string, message: string): Promise<void>;
    registerUser(name: string, email: string, password: string): Promise<boolean>;
    isEmailRegistered(email: string): Promise<boolean>;
    loginUser(email: string, password: string): Promise<LoginResult>;
    forgotPassword(email: string, newPassword: string): Promise<boolean>;
}

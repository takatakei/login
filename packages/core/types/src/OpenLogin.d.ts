/// <reference types="node" />
import { Ecies } from "@toruslabs/eccrypto";
import { JRPCRequest, OriginData } from "@toruslabs/openlogin-jrpc";
import { BaseLogoutParams, BaseRedirectParams, LoginParams, OPENLOGIN_NETWORK_TYPE, OpenLoginOptions, RequestParams, UX_MODE_TYPE } from "./constants";
import { Modal } from "./Modal";
import OpenLoginStore from "./OpenLoginStore";
import Provider from "./Provider";
export declare type OpenLoginState = {
    network: OPENLOGIN_NETWORK_TYPE;
    loginUrl: string;
    privKey?: string;
    support3PC?: boolean;
    clientId: string;
    iframeUrl: string;
    redirectUrl: string;
    webAuthnUrl: string;
    logoutUrl: string;
    store: OpenLoginStore;
    uxMode: UX_MODE_TYPE;
    replaceUrlOnRedirect: boolean;
    originData: OriginData;
};
declare class OpenLogin {
    provider: Provider;
    state: OpenLoginState;
    modal: Modal;
    constructor(options: OpenLoginOptions);
    initState(options: Required<OpenLoginOptions>): void;
    init(): Promise<void>;
    get privKey(): string;
    updateOriginData(): Promise<void>;
    getWhitelist(): Promise<OriginData>;
    _fastLogin(params: Partial<BaseRedirectParams>): Promise<{
        privKey: string;
    }>;
    login(params?: LoginParams & Partial<BaseRedirectParams>): Promise<{
        privKey: string;
    }>;
    _selectedLogin(params: LoginParams & Partial<BaseRedirectParams>): Promise<{
        privKey: string;
    }>;
    logout(logoutParams?: Partial<BaseLogoutParams> & Partial<BaseRedirectParams>): Promise<void>;
    request<T>(args: RequestParams): Promise<T>;
    _jrpcRequest<T, U>(args: JRPCRequest<T>): Promise<U>;
    _check3PCSupport(): Promise<Record<string, boolean>>;
    _setPIDData(pid: string, data: Record<string, unknown>[]): Promise<void>;
    _getData(): Promise<Record<string, unknown>>;
    _syncState(newState: Record<string, unknown>): void;
    _modal(params?: LoginParams & Partial<BaseRedirectParams>): Promise<{
        privKey: string;
    }>;
    _cleanup(): Promise<void>;
    encrypt(message: Buffer, privateKey?: string): Promise<Ecies>;
    decrypt(ciphertext: Ecies, privateKey?: string): Promise<Buffer>;
}
export default OpenLogin;

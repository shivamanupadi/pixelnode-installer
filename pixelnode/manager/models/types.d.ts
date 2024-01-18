import { DiskSpace } from "check-disk-space";
export interface OsParams {
    platform: string;
    type: string;
    arch: string;
    version: string;
    name: string;
    storage: DiskSpace;
    ram: number;
    cores: number;
}
export interface PrerequisitesParams {
    docker: boolean;
    node: boolean;
    variant?: NodeVariant;
}
export interface AlgodParams {
    algod: {
        url: string;
        port: string;
        token: string;
    };
    admin: {
        token: string;
    };
}
export type StatusParams = {
    catchpoint: string;
    "catchpoint-acquired-blocks": number;
    "catchpoint-processed-accounts": number;
    "catchpoint-total-accounts": number;
    "catchpoint-total-blocks": number;
    "catchpoint-verified-accounts": number;
    "catchup-time": number;
    "last-catchpoint": string;
    "last-round": number;
    "last-version": string;
    "next-version": string;
    "next-version-round": number;
    "next-version-supported": boolean;
    "stopped-at-unsupported-round": boolean;
    "time-since-last-round": number;
};
export interface NodeStatus {
    agent: {
        health: boolean;
    };
    node: {
        installed: boolean;
        health: boolean;
        caughtup: boolean;
        status?: StatusParams;
        variant: NodeVariant;
    };
}
export interface NodeVariant {
    id: string;
    name: string;
    dockerComposeFile: string;
    catchup: string;
    containerId: string;
}
export interface TelemetryConfig {
    guid: string;
    name: string;
}
export interface NodeEnv {
    GOGC: string;
    GOMEMLIMIT: string;
}

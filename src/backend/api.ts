// tslint:disable
/**
 * api.proto
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: version not set
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


import * as url from "url";
import * as isomorphicFetch from "isomorphic-fetch";
import { Configuration } from "./configuration";

const BASE_PATH = "http://localhost".replace(/\/+$/, "");

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

/**
 *
 * @export
 * @interface FetchAPI
 */
export interface FetchAPI {
    (url: string, init?: any): Promise<any>;
}

/**
 *  
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
    url: string;
    options: any;
}

/**
 * 
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
    protected configuration: Configuration;

    constructor(configuration?: Configuration, protected basePath: string = BASE_PATH, protected fetch: FetchAPI = isomorphicFetch) {
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        }
    }
};

/**
 * 
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
    name: "RequiredError"
    constructor(public field: string, msg?: string) {
        super(msg);
    }
}

/**
 * 
 * @export
 * @interface ApiAddTalkRequest
 */
export interface ApiAddTalkRequest {
    /**
     * 
     * @type {string}
     * @memberof ApiAddTalkRequest
     */
    userId?: string;
}

/**
 * 
 * @export
 * @interface ApiAddTalkResponse
 */
export interface ApiAddTalkResponse {
    /**
     * 
     * @type {ApiTalk}
     * @memberof ApiAddTalkResponse
     */
    talk?: ApiTalk;
}

/**
 * 
 * @export
 * @interface ApiAddUserRequest
 */
export interface ApiAddUserRequest {
    /**
     * 
     * @type {string}
     * @memberof ApiAddUserRequest
     */
    name?: string;
}

/**
 * 
 * @export
 * @interface ApiAddUserResponse
 */
export interface ApiAddUserResponse {
    /**
     * The newly added user.
     * @type {ApiUser}
     * @memberof ApiAddUserResponse
     */
    user?: ApiUser;
}

/**
 * 
 * @export
 * @interface ApiFetchAllResponse
 */
export interface ApiFetchAllResponse {
    /**
     * 
     * @type {string}
     * @memberof ApiFetchAllResponse
     */
    version?: string;
    /**
     * 
     * @type {Array&lt;ApiUser&gt;}
     * @memberof ApiFetchAllResponse
     */
    user?: Array<ApiUser>;
    /**
     * 
     * @type {Array&lt;ApiTalk&gt;}
     * @memberof ApiFetchAllResponse
     */
    talk?: Array<ApiTalk>;
}

/**
 * 
 * @export
 * @interface ApiGetUsersResponse
 */
export interface ApiGetUsersResponse {
    /**
     * 
     * @type {string}
     * @memberof ApiGetUsersResponse
     */
    version?: string;
    /**
     * 
     * @type {Array&lt;ApiUser&gt;}
     * @memberof ApiGetUsersResponse
     */
    user?: Array<ApiUser>;
}

/**
 * 
 * @export
 * @interface ApiRemoveUserResponse
 */
export interface ApiRemoveUserResponse {
}

/**
 * 
 * @export
 * @interface ApiReorderRequest
 */
export interface ApiReorderRequest {
    /**
     * 
     * @type {string}
     * @memberof ApiReorderRequest
     */
    version?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiReorderRequest
     */
    moveUserId?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiReorderRequest
     */
    anchorUserId?: string;
    /**
     * 
     * @type {boolean}
     * @memberof ApiReorderRequest
     */
    before?: boolean;
}

/**
 * 
 * @export
 * @interface ApiReorderResponse
 */
export interface ApiReorderResponse {
    /**
     * 
     * @type {boolean}
     * @memberof ApiReorderResponse
     */
    accepted?: boolean;
    /**
     * 
     * @type {string}
     * @memberof ApiReorderResponse
     */
    version?: string;
}

/**
 * 
 * @export
 * @interface ApiTalk
 */
export interface ApiTalk {
    /**
     * 
     * @type {string}
     * @memberof ApiTalk
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiTalk
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiTalk
     */
    speakerId?: string;
    /**
     * 
     * @type {boolean}
     * @memberof ApiTalk
     */
    done?: boolean;
    /**
     * 
     * @type {Array&lt;string&gt;}
     * @memberof ApiTalk
     */
    url?: Array<string>;
}

/**
 * 
 * @export
 * @interface ApiUpdateUserRequest
 */
export interface ApiUpdateUserRequest {
    /**
     * 
     * @type {string}
     * @memberof ApiUpdateUserRequest
     */
    userId?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiUpdateUserRequest
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiUpdateUserRequest
     */
    nextTalkName?: string;
}

/**
 * 
 * @export
 * @interface ApiUpdateUserResponse
 */
export interface ApiUpdateUserResponse {
}

/**
 * 
 * @export
 * @interface ApiUser
 */
export interface ApiUser {
    /**
     * 
     * @type {string}
     * @memberof ApiUser
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiUser
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof ApiUser
     */
    nextTalk?: string;
}


/**
 * ApiServiceApi - fetch parameter creator
 * @export
 */
export const ApiServiceApiFetchParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {ApiAddTalkRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addTalk(body: ApiAddTalkRequest, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling addTalk.');
            }
            const path = `/v1/talk`;
            const urlObj = url.parse(path, true);
            const requestOptions = Object.assign({ method: 'POST' }, options);
            const headerParameter = {} as any;
            const queryParameter = {} as any;

            headerParameter['Content-Type'] = 'application/json';

            urlObj.query = Object.assign({}, urlObj.query, queryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete urlObj.search;
            requestOptions.headers = Object.assign({}, headerParameter, options.headers);
            requestOptions.body = JSON.stringify(body || {});

            return {
                url: url.format(urlObj),
                options: requestOptions,
            };
        },
        /**
         * 
         * @param {ApiAddUserRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addUser(body: ApiAddUserRequest, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling addUser.');
            }
            const path = `/v1/user`;
            const urlObj = url.parse(path, true);
            const requestOptions = Object.assign({ method: 'POST' }, options);
            const headerParameter = {} as any;
            const queryParameter = {} as any;

            headerParameter['Content-Type'] = 'application/json';

            urlObj.query = Object.assign({}, urlObj.query, queryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete urlObj.search;
            requestOptions.headers = Object.assign({}, headerParameter, options.headers);
            requestOptions.body = JSON.stringify(body || {});

            return {
                url: url.format(urlObj),
                options: requestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        fetchAll(options: any = {}): FetchArgs {
            const path = `/v1/fetch-all`;
            const urlObj = url.parse(path, true);
            const requestOptions = Object.assign({ method: 'GET' }, options);
            const headerParameter = {} as any;
            const queryParameter = {} as any;

            urlObj.query = Object.assign({}, urlObj.query, queryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete urlObj.search;
            requestOptions.headers = Object.assign({}, headerParameter, options.headers);

            return {
                url: url.format(urlObj),
                options: requestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUsers(options: any = {}): FetchArgs {
            const path = `/v1/user`;
            const urlObj = url.parse(path, true);
            const requestOptions = Object.assign({ method: 'GET' }, options);
            const headerParameter = {} as any;
            const queryParameter = {} as any;

            urlObj.query = Object.assign({}, urlObj.query, queryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete urlObj.search;
            requestOptions.headers = Object.assign({}, headerParameter, options.headers);

            return {
                url: url.format(urlObj),
                options: requestOptions,
            };
        },
        /**
         * 
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeUser(userId: string, options: any = {}): FetchArgs {
            // verify required parameter 'userId' is not null or undefined
            if (userId === null || userId === undefined) {
                throw new RequiredError('userId','Required parameter userId was null or undefined when calling removeUser.');
            }
            const path = `/v1/user/{userId}`
                .replace(`{${"userId"}}`, encodeURIComponent(String(userId)));
            const urlObj = url.parse(path, true);
            const requestOptions = Object.assign({ method: 'DELETE' }, options);
            const headerParameter = {} as any;
            const queryParameter = {} as any;

            urlObj.query = Object.assign({}, urlObj.query, queryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete urlObj.search;
            requestOptions.headers = Object.assign({}, headerParameter, options.headers);

            return {
                url: url.format(urlObj),
                options: requestOptions,
            };
        },
        /**
         * 
         * @summary Change the position of one user in the list of upcoming talks.
         * @param {ApiReorderRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reorder(body: ApiReorderRequest, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling reorder.');
            }
            const path = `/v1/reorder`;
            const urlObj = url.parse(path, true);
            const requestOptions = Object.assign({ method: 'POST' }, options);
            const headerParameter = {} as any;
            const queryParameter = {} as any;

            headerParameter['Content-Type'] = 'application/json';

            urlObj.query = Object.assign({}, urlObj.query, queryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete urlObj.search;
            requestOptions.headers = Object.assign({}, headerParameter, options.headers);
            requestOptions.body = JSON.stringify(body || {});

            return {
                url: url.format(urlObj),
                options: requestOptions,
            };
        },
        /**
         * 
         * @param {string} userId 
         * @param {ApiUpdateUserRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateUser(userId: string, body: ApiUpdateUserRequest, options: any = {}): FetchArgs {
            // verify required parameter 'userId' is not null or undefined
            if (userId === null || userId === undefined) {
                throw new RequiredError('userId','Required parameter userId was null or undefined when calling updateUser.');
            }
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling updateUser.');
            }
            const path = `/v1/user/{userId}`
                .replace(`{${"userId"}}`, encodeURIComponent(String(userId)));
            const urlObj = url.parse(path, true);
            const requestOptions = Object.assign({ method: 'PATCH' }, options);
            const headerParameter = {} as any;
            const queryParameter = {} as any;

            headerParameter['Content-Type'] = 'application/json';

            urlObj.query = Object.assign({}, urlObj.query, queryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete urlObj.search;
            requestOptions.headers = Object.assign({}, headerParameter, options.headers);
            requestOptions.body = JSON.stringify(body || {});

            return {
                url: url.format(urlObj),
                options: requestOptions,
            };
        },
    }
};

/**
 * ApiServiceApi - functional programming interface
 * @export
 */
export const ApiServiceApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @param {ApiAddTalkRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addTalk(body: ApiAddTalkRequest, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<ApiAddTalkResponse> {
            const fetchArgs = ApiServiceApiFetchParamCreator(configuration).addTalk(body, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @param {ApiAddUserRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addUser(body: ApiAddUserRequest, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<ApiAddUserResponse> {
            const fetchArgs = ApiServiceApiFetchParamCreator(configuration).addUser(body, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        fetchAll(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<ApiFetchAllResponse> {
            const fetchArgs = ApiServiceApiFetchParamCreator(configuration).fetchAll(options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUsers(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<ApiGetUsersResponse> {
            const fetchArgs = ApiServiceApiFetchParamCreator(configuration).getUsers(options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeUser(userId: string, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<ApiRemoveUserResponse> {
            const fetchArgs = ApiServiceApiFetchParamCreator(configuration).removeUser(userId, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @summary Change the position of one user in the list of upcoming talks.
         * @param {ApiReorderRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reorder(body: ApiReorderRequest, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<ApiReorderResponse> {
            const fetchArgs = ApiServiceApiFetchParamCreator(configuration).reorder(body, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @param {string} userId 
         * @param {ApiUpdateUserRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateUser(userId: string, body: ApiUpdateUserRequest, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<ApiUpdateUserResponse> {
            const fetchArgs = ApiServiceApiFetchParamCreator(configuration).updateUser(userId, body, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
    }
};

/**
 * ApiServiceApi - factory interface
 * @export
 */
export const ApiServiceApiFactory = function (configuration?: Configuration, fetch?: FetchAPI, basePath?: string) {
    return {
        /**
         * 
         * @param {ApiAddTalkRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addTalk(body: ApiAddTalkRequest, options?: any) {
            return ApiServiceApiFp(configuration).addTalk(body, options)(fetch, basePath);
        },
        /**
         * 
         * @param {ApiAddUserRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        addUser(body: ApiAddUserRequest, options?: any) {
            return ApiServiceApiFp(configuration).addUser(body, options)(fetch, basePath);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        fetchAll(options?: any) {
            return ApiServiceApiFp(configuration).fetchAll(options)(fetch, basePath);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUsers(options?: any) {
            return ApiServiceApiFp(configuration).getUsers(options)(fetch, basePath);
        },
        /**
         * 
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        removeUser(userId: string, options?: any) {
            return ApiServiceApiFp(configuration).removeUser(userId, options)(fetch, basePath);
        },
        /**
         * 
         * @summary Change the position of one user in the list of upcoming talks.
         * @param {ApiReorderRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        reorder(body: ApiReorderRequest, options?: any) {
            return ApiServiceApiFp(configuration).reorder(body, options)(fetch, basePath);
        },
        /**
         * 
         * @param {string} userId 
         * @param {ApiUpdateUserRequest} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateUser(userId: string, body: ApiUpdateUserRequest, options?: any) {
            return ApiServiceApiFp(configuration).updateUser(userId, body, options)(fetch, basePath);
        },
    };
};

/**
 * ApiServiceApi - object-oriented interface
 * @export
 * @class ApiServiceApi
 * @extends {BaseAPI}
 */
export class ApiServiceApi extends BaseAPI {
    /**
     * 
     * @param {} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ApiServiceApi
     */
    public addTalk(body: ApiAddTalkRequest, options?: any) {
        return ApiServiceApiFp(this.configuration).addTalk(body, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @param {} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ApiServiceApi
     */
    public addUser(body: ApiAddUserRequest, options?: any) {
        return ApiServiceApiFp(this.configuration).addUser(body, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ApiServiceApi
     */
    public fetchAll(options?: any) {
        return ApiServiceApiFp(this.configuration).fetchAll(options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ApiServiceApi
     */
    public getUsers(options?: any) {
        return ApiServiceApiFp(this.configuration).getUsers(options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @param {} userId 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ApiServiceApi
     */
    public removeUser(userId: string, options?: any) {
        return ApiServiceApiFp(this.configuration).removeUser(userId, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @summary Change the position of one user in the list of upcoming talks.
     * @param {} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ApiServiceApi
     */
    public reorder(body: ApiReorderRequest, options?: any) {
        return ApiServiceApiFp(this.configuration).reorder(body, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @param {} userId 
     * @param {} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof ApiServiceApi
     */
    public updateUser(userId: string, body: ApiUpdateUserRequest, options?: any) {
        return ApiServiceApiFp(this.configuration).updateUser(userId, body, options)(this.fetch, this.basePath);
    }

}


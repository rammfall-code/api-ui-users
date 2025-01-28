/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export namespace V1 {
  /**
 * @description Get all users
 * @tags Users
 * @name GetUsers
 * @summary Get all users
 * @request GET:/v1/api/users
 * @response `200` `({
    id: string,
    name: string,
    age: number,

})[]` Default Response
*/
  export namespace GetUsers {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = {
      id: string;
      name: string;
      age: number;
    }[];
  }

  /**
   * @description Create user
   * @tags Users
   * @name CreateUser
   * @summary Create user
   * @request POST:/v1/api/users
   * @response `201` `string` Default Response
   */
  export namespace CreateUser {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = {
      /**
       * @minLength 4
       * @maxLength 30
       */
      name: string;
      /**
       * @min 1
       * @max 120
       */
      age: number;
    };
    export type RequestHeaders = {};
    export type ResponseBody = string;
  }

  /**
   * @description Delete user
   * @tags Users
   * @name DeleteUser
   * @summary Delete user
   * @request DELETE:/v1/api/users/{id}
   * @response `200` `string` Default Response
   * @response `400` `string` Default Response
   */
  export namespace DeleteUser {
    export type RequestParams = {
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = string;
  }
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { 'Content-Type': type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title @fastify/swagger
 * @version 9.4.2
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  v1 = {
    /**
 * @description Get all users
 *
 * @tags Users
 * @name GetUsers
 * @summary Get all users
 * @request GET:/v1/api/users
 * @response `200` `({
    id: string,
    name: string,
    age: number,

})[]` Default Response
 */
    getUsers: (params: RequestParams = {}) =>
      this.request<
        {
          id: string;
          name: string;
          age: number;
        }[],
        any
      >({
        path: `/v1/api/users`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * @description Create user
     *
     * @tags Users
     * @name CreateUser
     * @summary Create user
     * @request POST:/v1/api/users
     * @response `201` `string` Default Response
     */
    createUser: (
      data: {
        /**
         * @minLength 4
         * @maxLength 30
         */
        name: string;
        /**
         * @min 1
         * @max 120
         */
        age: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, any>({
        path: `/v1/api/users`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description Delete user
     *
     * @tags Users
     * @name DeleteUser
     * @summary Delete user
     * @request DELETE:/v1/api/users/{id}
     * @response `200` `string` Default Response
     * @response `400` `string` Default Response
     */
    deleteUser: (id: string, params: RequestParams = {}) =>
      this.request<string, string>({
        path: `/v1/api/users/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),
  };
}

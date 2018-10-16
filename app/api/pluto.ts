import axios, { AxiosRequestConfig, AxiosError } from "axios";
import getAPIHost from "./getHost";
import EnvChecker from "../helpers/envChecker";
import { CommonError } from "../model/error";

export const TIMEOUT_FOR_SAFE_RENDERING = 29500;

export default class PlutoAxios {
  public static getGlobalError(axiosResponse: AxiosError) {
    const errorObj: CommonError =
      axiosResponse.response && axiosResponse.response.data && axiosResponse.response.data.error;
    if (errorObj) {
      return errorObj;
    }
    return axiosResponse;
  }

  protected getInstance = () => {
    return axios.create({
      baseURL: getAPIHost(),
      withCredentials: true,
      timeout: EnvChecker.isOnServer() ? TIMEOUT_FOR_SAFE_RENDERING : 60000,
    });
  };

  protected get(path: string, config?: AxiosRequestConfig) {
    if (EnvChecker.isOnServer()) {
      console.log(`HTTP REQUEST - GET : ${getAPIHost() + path}`);
    }
    return this.getInstance().get(path, config);
  }

  protected post(path: string, data?: any, config?: AxiosRequestConfig) {
    if (EnvChecker.isOnServer()) {
      console.log(`HTTP REQUEST - POST : ${getAPIHost() + path}`);
    }
    return this.getInstance().post(path, data, config);
  }

  protected put(path: string, data?: any, config?: AxiosRequestConfig) {
    if (EnvChecker.isOnServer()) {
      console.log(`HTTP REQUEST - PUT : ${getAPIHost() + path}`);
    }
    return this.getInstance().put(path, data, config);
  }

  protected delete(path: string, config?: AxiosRequestConfig) {
    if (EnvChecker.isOnServer()) {
      console.log(`HTTP REQUEST - DELETE : ${getAPIHost() + path}`);
    }
    return this.getInstance().delete(path, config);
  }
}

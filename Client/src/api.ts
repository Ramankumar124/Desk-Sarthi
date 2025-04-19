import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { properties } from "./properties/properties";


const Api = axios.create({
  baseURL: `${properties.PUBLIC_BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log(properties.PUBLIC_BASE_URL);

Api.interceptors.response.use(
    (response:AxiosResponse)=>response,
    async(error:AxiosError)=>{
        const originalRequest=error.config as AxiosRequestConfig & { _retry?: boolean };
            // Check if the error is due to an expired access token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark the request as retried

            try {
                // Attempt to refresh the token
                await axios.post("/auth/refresh-token", {}, { withCredentials: true });
                // Retry the original request
                console.log("refreshing token");
                
                return Api(originalRequest);
              } catch (refreshError) {
                // Redirect to login if refresh fails
                window.location.href = "/";
                return Promise.reject(refreshError);
              }
        }
        return Promise.reject(error);
    }
)
export default Api
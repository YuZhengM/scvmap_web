import Axios from 'axios';

class RequestApi {
  /**
   * Request url
   * @param url
   */
  public static request(url: string) {
    return Axios.get(url);
  }

  /**
   * Download url
   * @param url
   */
  public static download(url: string) {
    return Axios({
      method: 'GET',
      url,
      responseType: 'blob'
    });
  }
}

export default RequestApi;

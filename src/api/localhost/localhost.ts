import RequestApi from '@/api/localhost/index';

export default class LocalhostApi {
  /**
   * Read file content
   * @param url
   */
  public static async readFile(url: string): Promise<Array<any>> {
    return RequestApi.request(process.env.BASE_URL + url)
      .then((res: any) => res.data);
  }

  /**
   * Download file
   * @param url
   * @param fileName
   */
  public static async downloadByALabel(url: string, fileName: string): Promise<void> {
    const link = document.createElement('a');
    link.download = fileName;
    link.style.display = 'none';
    link.href = process.env.BASE_URL + url;
    document.body.appendChild(link);
    link.click();
    // Release the URL object
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  }

  public static async downloadZip(name: string): Promise<void> {
    await RequestApi.download(`${process.env.BASE_URL}csv/${name}.csv`)
      .then((res: any) => {
        // const blob = new Blob([res]);
        const fileName = `${name}.csv`;
        // Non-IE download
        if ('download' in document.createElement('a')) {
          const link = document.createElement('a');
          link.download = fileName;
          link.style.display = 'none';
          link.href = URL.createObjectURL(res);
          document.body.appendChild(link);
          link.click();
          // Release the URL object
          URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        } else {
          // IE10+ download
          navigator.msSaveBlob(res, fileName);
        }
      });
  }
}

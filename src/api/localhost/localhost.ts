import RequestApi from '@/api/localhost/index';

export default class LocalhostApi {
  /**
   * 获取文件内容
   * @param url
   */
  public static async readFile(url: string): Promise<Array<any>> {
    return RequestApi.request(process.env.BASE_URL + url)
      .then((res: any) => res.data);
  }

  /**
   * 下载文件
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
    // 释放 URL 对象
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
  }

  public static async downloadZip(name: string): Promise<void> {
    await RequestApi.download(`${process.env.BASE_URL}csv/${name}.csv`)
      .then((res: any) => {
        // const blob = new Blob([res]);
        const fileName = `${name}.csv`;
        // 非 IE 下载
        if ('download' in document.createElement('a')) {
          const link = document.createElement('a');
          link.download = fileName;
          link.style.display = 'none';
          link.href = URL.createObjectURL(res);
          document.body.appendChild(link);
          link.click();
          // 释放 URL 对象
          URL.revokeObjectURL(link.href);
          document.body.removeChild(link);
        } else {
          // IE10+ 下载
          navigator.msSaveBlob(res, fileName);
        }
      });
  }
}

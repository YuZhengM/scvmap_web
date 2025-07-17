/**
 * 文件处理公共类
 */
class File {
  public static isExistByLink(filepath: string): boolean {
    if (filepath == null || filepath === '') {
      return false;
    }
    let xmlhttp;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xmlhttp.open('GET', filepath, false);
    xmlhttp.send();
    if (xmlhttp.readyState === 4) {
      if (xmlhttp.status === 200) {
        return true;
      }
      if (xmlhttp.status === 404) {
        return false;
      }
    }
    return false;
  }

  public static isExist(filepath: string): boolean {
    const fso = new ActiveXObject('Scripting.FileSystemObject');
    return fso.FileExists(filepath);
  }
}

export default File;

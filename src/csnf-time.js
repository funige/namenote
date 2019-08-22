
class CSNFTime {
  static toInt(string) {
    if (string === undefined) {
      return Date.now();
    }
    const year = string.slice(0, 4);
    const month = string.slice(4, 6);
    const day = string.slice(6, 8);
    const hour = string.slice(8, 10);
    const minute = string.slice(10, 12);
    const second = string.slice(12, 14);

    const date = new Date(`${year}-${month}-${day} ${hour}:${minute}:${second}`);
    return Math.floor(date.getTime());
  }

  static toString(unixtime) {
    if (unixtime === undefined) unixtime = Date.now();
    const date = new Date(unixtime);

    const year = ('0000' + date.getFullYear()).slice(-4);
    const month = ('00' + (date.getMonth() + 1)).slice(-2);
    const day = ('00' + date.getDate()).slice(-2);
    const hour = ('00' + date.getHours()).slice(-2);
    const minute = ('00' + date.getMinutes()).slice(-2);
    const second = ('00' + date.getSeconds()).slice(-2);
    return year + month + day + hour + minute + second;
  }
}

export { CSNFTime };

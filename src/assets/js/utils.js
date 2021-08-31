export const phoneCheck = (phone) => {
  var reg = /^1[3|4|5|7|8][0-9]{9}$/;
  return reg.test(phone);
};

export function _download(url) {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("Chrome") > -1) {
    window.open(url, "_blank");
  } else {
    let a = document.createElement("a");

    //2.给a标签的href赋上下载地址
    a.href = url;

    //3.让a标签不显示在视图中
    a.style.display = "none";

    //4.将a标签append到文档中
    document.body.appendChild(a);

    //5.a标签自点击
    a.click();

    //6.点击下载后，销毁这个节点
    document.body.removeChild(a);
    // window.location.href = this.downloadUrl;
  }
}

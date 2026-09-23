/*
 * BiliBili playurl 响应改写（Loon http-response 脚本）
 *
 * 作用：在 playurl 接口返回的 JSON 里，把视频 CDN 域名统一替换为目标 CDN，
 * 从源头避免 App 连接 Akamai / PCDN / mcdn 等节点。
 * 覆盖 api.bilibili.com / app.bilibili.com 上的 playurl / pgc playurl 接口。
 */
const TARGET_HOST = 'cn-gddg-ct-01-01.bilivideo.com';

const fixUrl = (u) => {
  if (typeof u !== 'string') return u;
  return u.replace(
    /^(https?):\/\/[^\/]+(\/(?:v\d+\/resource\/)?upgcxcode\/.*)$/i,
    `$1://${TARGET_HOST}$2`
  );
};

const fixItem = (item) => {
  if (!item) return;
  // dash 流：base_url + backup_url
  if (item.base_url) item.base_url = fixUrl(item.base_url);
  // durl 流（FLV/低版本接口）：url
  if (typeof item.url === 'string') item.url = fixUrl(item.url);
  if (Array.isArray(item.backup_url)) item.backup_url = item.backup_url.map(fixUrl);
};

const fixList = (list) => {
  if (Array.isArray(list)) list.forEach(fixItem);
};

const body = $response.body;
if (!body) {
  $done({});
}
try {
  const obj = JSON.parse(body);
  // 兼容 {dash}, {data:{dash}}, {result:{dash}} 三种响应结构
  [obj, obj.data, obj.result].filter(Boolean).forEach((root) => {
    fixList(root.dash);
    fixList(root.durl);
  });
  $done({ body: JSON.stringify(obj) });
} catch (e) {
  console.log('bili-playurl.js JSON parse failed: ' + e);
  $done({ body });
}

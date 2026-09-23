# BiliBili 重定向到正规 CDN (Loon)

🇭🇰 仅适合在中国大陆使用港澳台版
🍻 加载更流畅的 BiliBili 更值得干杯！

由 Surge 模块配置（`force-http-engine` + `mitm` + `url-rewrite`）转换而来的 Loon 插件。

## 使用

在 Loon 中添加远程插件：

```
https://raw.githubusercontent.com/MinamiHashiRun0/bilibili-cdn-rewrite/main/BiliBili.Redirect.plugin
```

开启 MitM 并信任 Loon 生成的 CA 证书即可。

## 说明

- 目标 CDN：`cn-gddg-ct-01-01.bilivideo.com`（广东东莞电信）
- 覆盖的流量：
  1. `:8000/v1/resource/` → reject（屏蔽）
  2. `*.akamaized.net`（如 `upos-hz-mirrorakam.akamaized.net`，B 站 Akamai 海外镜像）→ 重定向
  3. 任意 `*.bilivideo.cn` / `*.bilivideo.com` 的 `/upgcxcode/` 视频流量 → 重定向
  4. `:4480 / :4483 / :9102`（mcdn / P2P CDN 端口）的 `/upgcxcode/` 流量 → 重定向
  5. `*.szbdyd.com`（B 站自建 P2P 跳转域名）→ 重定向
  6. **兜底规则**：任何域名的 `/upgcxcode/` 视频流量一律重定向，保证 App 所有视频访问全部走目标 CDN
- 原配置中 mcdn 的 4483/8082 端口使用 `/v1/resource/upgcxcode/` 包装路径，本插件的正则已包含 `v1/resource` 前缀兼容。
- Surge 的 `force-http-engine` 在 Loon 中无对应功能；80 端口纯 HTTP 流量 Loon 原生处理，无需额外配置。
- 其他可替换的镜像 CDN 节点（可自行把插件中的目标域名替换为）：
  - `upos-sz-mirrorhw.bilivideo.com` 华为云
  - `upos-sz-mirrorcos.bilivideo.com` 腾讯云
  - `upos-sz-mirrorbs.bilivideo.com` 白山云
  - `upos-sz-mirrorali.bilivideo.com` 阿里云
  - `cn-gddg-ct-01-01.bilivideo.com` 广东东莞电信（本插件默认）
  - `cn-lnsy-cu-01-01.bilivideo.com` 辽宁沈阳联通
  - `cn-gddg-cm-01-01.bilivideo.com` 广东东莞移动

## Credits

原始 Surge 配置来自网络（BiliBili 重定向到正规 CDN 模块），感谢原作者。

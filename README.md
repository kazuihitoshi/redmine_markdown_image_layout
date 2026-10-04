# Redmine Plugin Markdown Image Layout

Redmine のテキスト書式が Markdown（CommonMark）のとき、本文に貼った画像を横幅の 30% で表示します。空行を挟まずに続けた画像は横に並び、空行がある場合は次の行になります。画像をクリックすると元の大きさで開き、もう一度クリックするか Esc で閉じます。

貼り付けた画像は `![]()` として挿入されます。

```markdown
![](a.png)
![](b.png)
```

上のように空行がなければ、同じ行に 30% ずつ並びます。

```markdown
![](a.png)

![](b.png)
```

空行があれば、それぞれ 30% のまま次の行になります。横幅に 30% が入りきらない画像は、空行がなくても次の行へ回ります。

## 動作

- テキスト書式が Markdown のときだけ動きます。Textile や書式なしでは、いままでどおり表示します。
- 対象はチケット、Wiki、その他の本文です。文章の途中に混ざった画像ではなく、独立した行の画像を対象にします。リスト項目の中でも同じです。
- 幅は固定で 30% です。
- 拡大表示は画面をクリックするか Esc で閉じます。

## ライセンス

Copyright 2026 kazuihitoshi@gmail.com

GNU General Public License version 2（またはそれ以降のバージョン）です。本文は `LICENSE` にあります。

## 導入

`plugins/redmine_markdown_image_layout` に配置し、Redmine を再起動してください。Redmine 5.0 以上が必要です。

## Docker で試す

このディレクトリで次を実行します。Redmine のイメージは `6.1.2` に固定しています。

```
docker compose up
```

ブラウザで http://localhost:3000 を開きます。初回のデータベース作成には少し時間がかかります。初期の管理者は `admin` / `admin` です。

添付ファイル、ログ、プラグイン置き場、テーマ、データベースは `temp/` に保存します。このプラグインだけは、リポジトリ直下をコンテナの `plugins/redmine_markdown_image_layout` にマウントします。

// ウェブブラウザで駆動させる簡易フロントエンドアプリケーション
'use strict';

console.log("index.js loaded");

document.getElementById('userInfo').addEventListener('click', async () => {
    const userId: string = "inoueshinichi";
    await fetchUserInfo(userId);
});

type UserInfo = {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
    name: string;
    company?: string;
    blog?: string;
    location: string;
    email?: string;
    hireable?: string;
    bio: string;
    twitter_username?: string;
    public_repos: string;
    public_gists: string;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
};

function escapeSpecialChars(str: string) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// タグ関数でHTMLテンプレートのエスケープを簡単にする.
function escapeHTML(strings, ...values) {
    return strings.reduce((result, str, i) => {
        const value = values[i - 1];
        if (typeof value === "string") {
            return result + escapeSpecialChars(value) + str;
        } else {
            return result + String(value) + str;
        }
    });
}

async function visualize(userInfo: UserInfo) {
    const result: HTMLElement | null = document.getElementById("result");

    // タグ付きテンプレート
    const view = escapeHTML`
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100">
    <dl>
        <dt>Location</dt>
        <dd>${userInfo.location}</dd>
        <dt>Repositories</dt>
        <dd>${userInfo.public_repos}</dd>
    </dl>
    `;
    result!.innerHTML = view;
}

async function fetchUserInfo(userId: string): Promise<any> {
    // リクエスト生成
    const uri: string = `https://api.github.com/users/${encodeURIComponent(userId)}`;

    // 非同期でレスポンスの受け取り(fetch API)
    fetch(uri).then((response: Response) => {
        console.log(response.status); // 200

        // レスポンスが返されたことを確認する
        if (!response.ok) {
            console.error("エラーレスポンス", response);
        } else {
            // 非同期でPromise<void>を返す
            return response.json().then(async (userInfo: any) => {
                // JSONパースされたオブジェクトが渡される
                console.log(userInfo);
                await visualize(userInfo);
            });
        }
    }).catch((error) => {
        console.error(error);
    });
}









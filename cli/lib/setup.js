/**
 * Cloudflare DNS + GitHub Pages 自定义域名（与 js-clawhub 脚本逻辑一致，配置外置）。
 */

import { getDeployConfig, loadEnv } from './deploy-config.js';

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

function getCfAuthHeaders(env) {
    const apiKey = env.CLOUDFARE_API_KEY || env.CLOUDFLARE_API_TOKEN || env.CLOUDFLARE_API_KEY;
    const email = env.CLOUDFLARE_EMAIL;

    if (!apiKey) {
        throw new Error('请在 .env 中配置 CLOUDFARE_API_KEY 或 CLOUDFLARE_API_TOKEN');
    }

    if (email) {
        return {
            'X-Auth-Email': email,
            'X-Auth-Key': apiKey,
            'Content-Type': 'application/json',
        };
    }
    return {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    };
}

async function cfFetch(path, options = {}) {
    const url = `https://api.cloudflare.com/client/v4${path}`;
    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) {
        const err = data.errors?.[0] || { message: res.statusText };
        throw new Error(`Cloudflare API 错误: ${err.message} (code: ${err.code})`);
    }
    if (!data.success) {
        throw new Error(data.errors?.[0]?.message || 'Cloudflare API 请求失败');
    }
    return data;
}

async function getAccountId(headers) {
    const data = await cfFetch('/accounts', { headers });
    const accounts = data.result || [];
    if (accounts.length === 0) throw new Error('未找到 Cloudflare 账户');
    return accounts[0].id;
}

async function getZoneId(headers, domain) {
    const data = await cfFetch(`/zones?name=${domain}`, { headers });
    const zones = data.result || [];
    return zones.length > 0 ? zones[0].id : null;
}

async function createZone(headers, accountId, domain) {
    const data = await cfFetch('/zones', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            name: domain,
            account: { id: accountId },
            jump_start: true,
            type: 'full',
        }),
    });
    const zone = data.result;
    console.log(`已创建 Zone: ${zone.name}，Zone ID: ${zone.id}`);
    console.log(`请到域名注册商处将 NS 记录改为: ${zone.name_servers.join(', ')}`);
    return zone.id;
}

async function listDnsRecords(headers, zoneId) {
    const data = await cfFetch(`/zones/${zoneId}/dns_records`, { headers });
    return data.result || [];
}

async function createOrUpdateDnsRecord(headers, zoneId, domain, record) {
    const { name, type, content, proxied = false } = record;
    const fullName = name === '@' ? domain : `${name}.${domain}`;

    const records = await listDnsRecords(headers, zoneId);
    const existing = records.find((r) => r.name === fullName && r.type === type);

    const body = { type, content, proxied, ttl: 1, name: fullName };

    if (existing) {
        await cfFetch(`/zones/${zoneId}/dns_records/${existing.id}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body),
        });
        console.log(`已更新 DNS: ${fullName} ${type} -> ${content}`);
    } else {
        await cfFetch(`/zones/${zoneId}/dns_records`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });
        console.log(`已添加 DNS: ${fullName} ${type} -> ${content}`);
    }
}

function getGhAuthHeaders(env) {
    const token = env.GITHUB_TOKEN;
    if (!token) {
        throw new Error('请在 .env 中配置 GITHUB_TOKEN');
    }
    return {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
    };
}

async function ghFetch(path, headers, options = {}) {
    const url = `https://api.github.com${path}`;
    const res = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
        const msg = data?.message || res.statusText;
        throw new Error(`GitHub API 错误: ${msg}`);
    }
    return data;
}

async function updatePages(headers, owner, repo, body) {
    await ghFetch(`/repos/${owner}/${repo}/pages`, headers, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

async function createPagesSite(headers, owner, repoName, source) {
    const path = source.path?.startsWith('/') ? source.path : `/${source.path || 'docs'}`;
    await ghFetch(`/repos/${owner}/${repoName}/pages`, headers, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            build_type: 'legacy',
            source: { branch: source.branch, path },
        }),
    });
}

function isGhNotFound(err) {
    return /404|Not Found/i.test(err.message);
}

export async function setupCloudflare() {
    const cfg = getDeployConfig();
    const { domain, githubPagesTarget } = cfg;

    console.log(`=== Cloudflare 域名配置 (${domain}) ===\n`);

    const env = loadEnv();
    const headers = getCfAuthHeaders(env);

    let zoneId = await getZoneId(headers, domain);
    if (!zoneId) {
        console.log('未找到 Zone，尝试创建...');
        const accountId = await getAccountId(headers);
        zoneId = await createZone(headers, accountId, domain);
    } else {
        console.log(`已找到 Zone: ${domain}`);
    }

    const records = [
        { name: '@', type: 'CNAME', content: githubPagesTarget, proxied: false },
        { name: 'www', type: 'CNAME', content: githubPagesTarget, proxied: false },
    ];

    for (const record of records) {
        await createOrUpdateDnsRecord(headers, zoneId, domain, record);
    }

    console.log('\n配置完成。DNS 生效可能需要几分钟。');
    console.log(`请确保 GitHub Pages 已设置自定义域: ${domain}`);
    console.log(`（CNAME 目标: ${githubPagesTarget}）`);
}

export async function setupGithubPages() {
    const cfg = getDeployConfig();
    const { domain, githubRepo, pagesDefaultSource } = cfg;
    const [owner, repo] = githubRepo.split('/');

    console.log('=== GitHub Pages 自定义域名配置 ===\n');
    console.log(`仓库: ${githubRepo}，域名: ${domain}\n`);

    const env = loadEnv();
    const headers = getGhAuthHeaders(env);

    let pages;
    try {
        pages = await ghFetch(`/repos/${owner}/${repo}/pages`, headers);
    } catch (e) {
        if (!isGhNotFound(e)) throw e;
        console.log('未检测到已启用的 Pages，正在通过 API 启用（legacy，分支 ' + pagesDefaultSource.branch + '，/docs）...');
        try {
            await createPagesSite(headers, owner, repo, pagesDefaultSource);
        } catch (createErr) {
            if (!/409|Conflict/i.test(createErr.message)) throw createErr;
            console.log('Pages 已存在（409），继续读取配置...');
        }
        pages = await ghFetch(`/repos/${owner}/${repo}/pages`, headers);
    }

    let source = { ...pagesDefaultSource };
    if (pages.source) {
        source = { branch: pages.source.branch, path: pages.source.path || '/' };
    }

    console.log(`设置自定义域名: ${domain} ...`);
    await updatePages(headers, owner, repo, { cname: domain, source });
    console.log('自定义域名已设置，等待 DNS 验证...\n');

    const maxAttempts = 24;
    const intervalMs = 5000;
    let domainVerified = false;

    for (let i = 0; i < maxAttempts; i++) {
        await sleep(intervalMs);
        const pages = await ghFetch(`/repos/${owner}/${repo}/pages`, headers);
        const state = pages.protected_domain_state || '';
        const certState = pages.https_certificate?.state || '';

        console.log(`  [${i + 1}/${maxAttempts}] 域名状态: ${state}, 证书: ${certState}`);

        if (certState === 'approved') {
            domainVerified = true;
            break;
        }
    }

    if (!domainVerified) {
        console.log('\n域名验证超时，请稍后手动执行 npm run gh:pages 开启 HTTPS');
        return;
    }

    console.log('\n域名已验证，启用强制 HTTPS...');
    await updatePages(headers, owner, repo, { cname: domain, source, https_enforced: true });
    console.log('已启用强制 HTTPS');
}

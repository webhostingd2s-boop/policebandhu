const https = require('https');
const http = require('http');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    if (req.method !== 'POST' || req.url !== '/cid_case') {
        res.writeHead(404);
        return res.end('Not found');
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
        const postData = querystring.stringify({
            authToken : 'Bangao@DFGH256$%^@25112025',
            case_no   : JSON.parse(body).case_no   || '2',
            ps_id     : JSON.parse(body).ps_id     || '14',
            case_year : JSON.parse(body).case_year || '2025',
        });

        const options = {
            hostname       : 'sitrep-cid.wb.gov.in',
            path           : '/Api_Bangaon/cid_case',
            method         : 'POST',
            rejectUnauthorized: false,
            secureOptions  : require('constants').SSL_OP_LEGACY_SERVER_CONNECT,
            headers        : {
                'Content-Type'   : 'application/x-www-form-urlencoded',
                'Content-Length' : Buffer.byteLength(postData),
            },
        };

        const apiReq = https.request(options, (apiRes) => {
            let data = '';
            apiRes.on('data', chunk => data += chunk);
            apiRes.on('end', () => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            });
        });

        apiReq.on('error', (e) => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: false, message: e.message }));
        });

        apiReq.write(postData);
        apiReq.end();
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

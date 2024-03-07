const https = require('https');

function fetchDataByHTMLProcessing(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            let html = '';
            response.on('data', (chunk) => {
                html += chunk;
            });
            response.on('end', () => {
                resolve(html);
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

module.exports = fetchDataByHTMLProcessing;
import https from 'k6/https';
import { sleep } from 'k6';
import { check } from 'k6';
import { getRealFiscalCode } from './modules/helpers';

export let options = {
    scenarios: {
        contacts: {
            executor: 'constant-arrival-rate',
            rate: __ENV.rate, // e.g. 20000 for 20K iterations
            duration: __ENV.duration, // e.g. '1m'
            preAllocatedVUs: __ENV.preAllocatedVUs, // e.g. 500
            maxVUs: __ENV.maxVUs // e.g. 1000
        }
    },
    thresholds: {
        https_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
        'https_req_duration{pagoPaMethod:GetMessages}': ['p(95)<1000'], // threshold on API requests only
        'https_req_duration{pagoPaMethod:GetMessage}': ['p(95)<1000'], // threshold on API requests only

    },
};

export default function () {
    // Values from env var.
    var urlBasePath = `${__ENV.FUNC_BASE_URL}`
    var funcKey = `${__ENV.FUNC_KEY}`
    var fiscalCode = getRealFiscalCode();

    var headersParams = {
        headers: {
            'Content-Type': 'application/json',
            'x-functions-key': funcKey,
        },
    };
    // Get Message List 1st Page.
    var tag = {
        pagoPaMethod: "GetMessages",
    };
    var url = `${urlBasePath}/api/v1/messages/${fiscalCode}?page_size=10&enrich_result_data=true`;
    var payload = JSON.stringify({

    });

    var messageIds = [];
    var r = https.get(url, payload, headersParams, {
        tags: tag,
    });
    console.log("Get Users' messages Status " + r.status);
    if (r.status !== 200){
        console.log(`GetMessages status error is ${r.status}, response ${JSON.parse(r.body)}`)
    }
    check(r, { 'GetMessages status is 200': (r) => r.status === 200 }, tag);

    var resultJsonBody = JSON.parse(r.body);
    resultJsonBody.items.forEach(el => messageIds.push(el.id));
    var maximumId = resultJsonBody.next;

    // Simulating getting 2nd page

    tag = {
        pagoPaMethod: "GetMessages",
    };
    url = `${urlBasePath}/api/v1/messages/${fiscalCode}?page_size=10&enrich_result_data=true&maximumId=${maximumId}`;
    var payload = JSON.stringify({

    });
    var r = https.get(url, payload, headersParams, {
        tags: tag,
    });
    resultJsonBody = JSON.parse(r.body);
    resultJsonBody.items.forEach(el => messageIds.push(el.id));

    console.log("Get Users' messages Status 2nd page" + r.status);
    check(r, { 'GetMessages 2nd page status is 200': (r) => r.status === 200 }, tag);

    //Simulating GetMessage Detail.
    sleep(1);
    var randomMessageId = messageIds[Math.floor(Math.random() * messageIds.length)];

    // Get Message Detail
    tag = {
        pagoPaMethod: "GetMessage",
    };
    url = `${urlBasePath}/api/v1/api/v1/messages/${fiscalCode}/${randomMessageId}`;
    r = https.get(url, headersParams, {
        tags: tag,
    });
    console.log('Get Message detail: ' + r.status + ' with messageId: ' + randomMessageId);
        check(r, { 'Get Message is 200': (r) => (r.status === 200) },
            tag
        );
}

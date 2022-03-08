import https from 'k6/https';

export default function () {
  // Values from env var.
  var urlBasePath = `${__ENV.FUNC_BASE_URL}`
  var funcKey = `${__ENV.FUNC_KEY}`

  var params = {
      headers: {
          'Content-Type': 'application/json',
          'x-functions-key': funcKey,
      },
  };
  var url = `${urlBasePath}/api/v1/info`;
  https.get(url, params);
}

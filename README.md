# Load tests for IO Messages

This is a set of [k6](https://k6.io) load tests related to the IO Messages.

To invoke k6 load test passing parameter use -e (or --env) flag:
```
-e MY_VARIABLE=MY_VALUE
```


## 01. Function Info page

This test is not very useful since it just calls the function app info page.

```
$ docker run -i --rm -v $(pwd)/src:/src  -e FUNC_KEY=${FUNC_KEY} -e FUNC_BASE_URL=${FUNC_BASE_URL} loadimpact/k6 run /src/get_cgn_info.js
```

## 02. Messages load and details (without pagination)

This test represents the usage of message list and request for message's detail.

```
$ docker run -i --rm -v $(pwd)/src:/src -e FUNC_BASE_URL=${FUNC_BASE_URL} -e FUNC_KEY=${FUNC_KEY} -e rate=${rate} -e duration=${duration} -e preAllocatedVUs=${preAllocatedVUs} -e maxVUs=${maxVUs} loadimpact/k6 run /src/user_get_messages_detail.js
```

## 03. Messages load and details (with pagination)

This test represents the usage of message list and request for message's detail.

```
$ docker run -i --rm -v $(pwd)/src:/src -e FUNC_BASE_URL=${FUNC_BASE_URL} -e FUNC_KEY=${FUNC_KEY} -e rate=${rate} -e duration=${duration} -e preAllocatedVUs=${preAllocatedVUs} -e maxVUs=${maxVUs} loadimpact/k6 run /src/user_get_messages_paginated_detail.js
```
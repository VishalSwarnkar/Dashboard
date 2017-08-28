# dashboard

This tool is hosted at [http://localhost:1344/jira](dashboard)

## Purpose

1. Rapidly search jira ticket information
2. Get the graph to show current status of issues
3. It also helps in finding out current certification testing status
4. You can export the out come in PDF, excel or csv files

## Configure project details

```
Configure tool for your project, below is the sample given

file path: configs->projectConfigs.json
{
    "Project": ["sample"],
    "JiraHostUrl": "you jira api url",
    "JQLQuery": "jql=project in (sample) AND issuetype='Bug' AND created >= -12w &maxResults=5",
    "ColHeader": ["Created", "JiraTicket", "Summary", "Priority", "Labels"],
    "bannerData":["Note:", "Nothing"],
    "cacheTime" : "",
    "chartType" : ["Product","Date"],
    "cert_path" : "public/javascript/certs/certificate.pem",
    "cert_user" : "you user name",
    "cert_pass" : "your cert password"
}


```
## To start server
```
$ npm start
```

Default port=1344, to change
```
export PORT=<your port number>

$ npm start
```
This is will generate error logs (i.e err.log) and output logs (i.e out.log)

Now you can access Dashboard application through [http://localhost:1344/jira](http://localhost:1344/jira)


## To stop the server

```
$ npm stop

```

## Cache for 12hours

On first user request the response will be stored in cache, so until 12hours every response will be from cache.
To clear the cache [http://localhost/clearCache](http://10.10.36.55:1344/clearCache)

## Routers

1. Jira ticket information in table format [http://localhost:1344/jira/?data=canned] Jira Table
2. Graphs to represent current status of issues in your project [http://localhost:1344/charts/?data=canned] Jira Charts

## Developer instruction

 Clone this repository

```
$ git clone
$ cd Dashboard
$ npm install
```
 Configure dev cert in the application to run locally

```
In the following file update the code snippet : public->javascript->datafeature.js

var cert = fs.readFileSync(process.env.CERT);

and

Replace "strictSSL : true" to use "cert: cert, key: cert, passphrase: process.env.PHRASE, securityOptions: 'SSL_OP_NO_SSLv3'"

Update the projectConfigs update with correct user name and cert password
```

## Run the test

```
$ npm test
```
This is to insure basic functionality are working

var request = require("request"),
    baseUrl = "http://localhost:1344";

describe("Device certification status app", function(){

    describe("Get /", function(){

        it("returns status code 200", function(done){
            request.get(baseUrl, function(error, response, body){
                expect(response.statusCode).toBe(200);
                done();
            });
        });

        it("returns valid canned data", function(done){
           request.get(baseUrl + "/jira", function(error, response, body){
                expect(response.statusCode).toBe(200);
              done();
           });
        });
    });
});

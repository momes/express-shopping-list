const request = require("supertest");

const app = require("./app");

let items = require("./fakeDb");
let test_items = [ //camelCase
        { name: "popsicle", price: 1.45 },
        { name: "cheerios", price: 3.40 }
    ]


beforeEach(function() {
    items = test_items;
});




describe("Test all /items routes", function() {// maybe break up this describe more
    it("GET '/' - get a list of all items", async function() {
      const resp = await request(app).get(`/items`);
  
      expect(resp.body).toEqual({ items: test_items });
      expect(resp.statusCode).toEqual(200);
    });

    it("POST '/'- add a new valid item", async function() {
        const resp = await request(app)
          .post(`/items`)
          .send({
            "name": "twinkie", "price": 0 //keys don't need to be in quotes
          });
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
          added: { "name": "twinkie", "price": 0.99}
        });
    });

    it("POST '/'- doesn't add an new item if missing JSON key", async function() {
        const resp = await request(app)
          .post(`/items`)
          .send({
            "badKey": "twinkie", "price": 0.99
          });
        expect(resp.statusCode).toEqual(400);
    });

    it("POST '/'- doesn't add an new item if price is invalid", async function() {
        const resp = await request(app)
          .post(`/items`)
          .send({
            "name": "twinkie", "price": "one-dollar"
          });
        expect(resp.statusCode).toEqual(400);
    });

    it("GET - Gets a single item", async function() {
        const resp = await request(app).get(`/items/${test_items[0].name}`);
        expect(resp.body).toEqual({ name: "popsicle", price: 1.45 });
        expect(resp.statusCode).toEqual(200);
      });
    
    it("GET - Responds with 404 if can't find item", async function() {
        const resp = await request(app).get(`/items/badItem`);
        expect(resp.statusCode).toEqual(404);
      });

    it("PATCH - Updates a single item", async function() {
      const resp = await request(app)
                .patch(`/items/popsicle`)
                .send({
                  "name": "twinkie", "price": 15.00
                });
      expect(resp.body).toEqual({"updated": {name: "twinkie", price: 15.00}});
      expect(resp.statusCode).toEqual(200);
    });
    it("PATCH - Responds with 404 if item not found", async function() {
      const resp = await request(app)
                .patch(`/items/fake`)
                .send({
                  "name": "twinkie", "price": 15.00
                });
      expect(resp.statusCode).toEqual(404);
    });
    it("PATCH - Responds with 400 if invalid data sent", async function() {
      const resp = await request(app)
                .patch(`/items/popsicle`)
                .send({
                  "name": "twinkie", "price": "not a number"
                });
      //add something to test error message??
      //test resp.body message that we get, expect toThrow (diff syntax)
      expect(resp.statusCode).toEqual(400);
    });
    it("Delete - deletes an item", async function() {
      const resp = await request(app).delete(`/items/popsicle`);
      expect(resp.statusCode).toEqual(200);
      expect(items.length).toEqual(1);
    });

});
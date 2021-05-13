const request = require("supertest");

const app = require("./app");

let items = require("./fakeDb");
let test_items = [
        { name: "popsicle", price: 1.45 },
        { name: "cheerios", price: 3.40 }
    ]


beforeEach(function() {
    items = test_items;
});




describe("Test all /items routes", function() {
    it("GET '/' - get a list of all items", async function() {
      const resp = await request(app).get(`/items`);
  
      expect(resp.body).toEqual({ items: test_items });
      expect(resp.statusCode).toEqual(200);
    });

    it("POST '/'- add a new valid item", async function() {
        const resp = await request(app)
          .post(`/items`)
          .send({
            "name": "twinkie", "price": 0.99
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

    it("Gets a single item", async function() {
        const resp = await request(app).get(`/items/${test_items[0].name}`);
        expect(resp.body).toEqual({ name: "popsicle", price: 1.45 });
        expect(resp.statusCode).toEqual(200);
      });
    
    it("Responds with 404 if can't find item", async function() {
        const resp = await request(app).get(`/items/badItem`);
        expect(resp.statusCode).toEqual(404);
      });
});
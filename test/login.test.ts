import { suite, test } from "mocha-typescript";
import * as chai from "chai";
import { app } from "../src";
import { expect } from "chai";

chai.use(require("chai-http"));

@suite("登录测试")
class LoginTest {

    @test async "未登录拦截"() {
        let res = await chai.request(app).get("/profile");

        expect(res).status(200);
        expect(res).has.property("text").and.contains(`<form action="/login" method="POST">`, "跳转到登录页");
    }

    @test async "正常登录"() {
        let res = await chai.request(app).post("/login").send({ username: "diluka", password: "pass" });

        expect(res).status(200);
        expect(res).has.property("text").and.contains(`DiX`, "跳转到资料页资料页");
    }
}
import { Get, JsonController, UseBefore } from "routing-controllers";
import * as passport from "passport";

@JsonController("/api")
export class HelloController {
    @Get("/hello")
    @UseBefore(passport.authenticate("bearer"))
    hello() {
        return { message: "Hello World!" };
    }
}
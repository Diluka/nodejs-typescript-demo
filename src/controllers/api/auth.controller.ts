import { JsonController, Post, Get } from "routing-controllers";

@JsonController("/api")
export class AuthController {

    @Post("/login")
    login() {

    }

    @Get("/logout")
    logout() {

    }
}
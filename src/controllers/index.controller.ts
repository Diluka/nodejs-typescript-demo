import { Controller, Render, Get, EmptyResultCode, Req, Session, UseBefore } from "routing-controllers";
import { User } from "../models/user";

@Controller()
export class IndexController {

    @Get()
    @Render("index")
    @EmptyResultCode(200)
    index() {
        return { message: "Hello World!" };
    }

    @Get("/login")
    @Render("login")
    @EmptyResultCode(200)
    login() {
        return { message: null };
    }

    @Get("/profile")
    @Render("profile")
    @EmptyResultCode(200)
    @UseBefore(require("connect-ensure-login").ensureLoggedIn())
    profile( @Req() req) {
        return { nickname: req.user.nickname };
    }

    @Get("/profile2")
    @Render("profile")
    @EmptyResultCode(200)
    @UseBefore(require("connect-ensure-login").ensureLoggedIn())
    profile2( @Req() req) {
        return { nickname: `${req.user.nickname} from profile2` };
    }
}
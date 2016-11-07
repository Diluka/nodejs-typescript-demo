import { User } from "./models/user";
import * as express from "express";

export function configPassport(app: express.Application, passport) {
    const LocalStrategy = require("passport-local").Strategy;

    let localStrategy = new LocalStrategy((username, password, done) => {
        User.findOne({ where: { username } }).then((user: User) => {
            if (!user) {
                return done(null, false, { message: "Incorrect username." });
            }
            if (user.password !== password) {
                return done(null, false, { message: "Incorrect password." });
            }
            return done(null, user);
        }).catch(err => {
            console.log(err);
            done(err);
        });
    });

    passport.use(localStrategy);

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id).then((user: User) => {
            done(null, user);
        }).catch(e => {
            done(e, null);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.post("/login",
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), (req, res) => { res.redirect(req.session.returnTo || "/profile"); }
    );
}
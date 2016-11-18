import { User } from './models/user';
import * as express from "express";
import { createLocalRedisClient, RedisDatabase, getLocalRedisClient } from "./redis";
import { getMyLogger } from "./log4js";
import * as passport from "passport";
import { app } from "./app";
import * as uuid from "node-uuid";

const logger = getMyLogger("passport.ts");

export function configPassport(app: express.Application) {
    const LocalStrategy = require("passport-local").Strategy;
    const BearerStrategy = require("passport-http-bearer").Strategy;

    let localStrategy = new LocalStrategy((username, password, done) => {
        User.findOne({ where: { username } }).then(async (user: User) => {
            if (!user) {
                return done(null, false, { message: "Incorrect username." });
            }
            if (user.password !== password) {
                return done(null, false, { message: "Incorrect password." });
            }
            await user.newToken();
            return done(null, user);
        }).catch(err => {
            logger.info(err);
            done(err);
        });
    });

    let bearerStrategy = new BearerStrategy((token, done) => {
        User.findByToken(token).then((user) => {
            done(null, user, { scope: "all" });
        }).catch(err => {
            logger.info(err);
            done(err);
        });
    });

    passport.use(localStrategy);
    passport.use(bearerStrategy);

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

    app.post("/api/login",
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), (req, res) => { res.send(req.session.user); }
    );
}
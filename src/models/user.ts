import { Model, Sequelize, DataTypes } from "sequelize";
import { Options, Attribute } from "sequelize-decorators";
import { Container } from "typedi";
import { getLocalRedisClient, RedisDatabase } from '../redis';
import * as uuid from "node-uuid";

@Options({
    sequelize: Container.get(Sequelize)
})
export class User extends Model {

    id: number;

    @Attribute({
        type: DataTypes.STRING,
        unique: true,
        validate: {
            notNull: true,
            notEmpty: true,
            len: [6, 24]
        }
    })
    username: string;

    @Attribute({
        type: DataTypes.STRING,
        validate: {
            notNull: true,
            notEmpty: true,
            len: [6, 24]
        }
    })
    password: string;

    @Attribute({
        type: DataTypes.STRING,
        validate: {
            notNull: true,
            notEmpty: true,
            isEmail: true
        }
    })
    email: string;

    @Attribute({
        type: DataTypes.STRING,
        validate: {
            notNull: true,
            notEmpty: true,
        }
    })
    nickname: string;

    @Attribute({
        type: DataTypes.INTEGER,
        validate: {
            min: 0,
            max: 120
        }
    })
    age: number;

    get token() {
        return User.getToken(this);
    }

    newToken() {
        return User.setToken(this);
    }

    static TOKEN_EXPIRE = 7 * 24 * 3600;

    static async getToken(user: User) {
        let rc = getLocalRedisClient();
        await rc.selectAsync(RedisDatabase.USER_TOKEN);
        return await rc.multi().get(user.id).expire(user.id, User.TOKEN_EXPIRE).execAsync()[0];
    }

    static async setToken(user: User) {
        let rc = getLocalRedisClient();
        await rc.selectAsync(RedisDatabase.USER_TOKEN);
        let token = uuid.v4();
        await rc.multi().setex(token, User.TOKEN_EXPIRE, user.id).setex(user.id, User.TOKEN_EXPIRE, token).execAsync();
        return token;
    }

    static async findByToken(token: string) {
        let rc = getLocalRedisClient();
        await rc.selectAsync(RedisDatabase.USER_TOKEN);
        let userId = await rc.multi().get(token).expire(token, User.TOKEN_EXPIRE).execAsync()[0];
        return await User.findById(userId);
    }
}
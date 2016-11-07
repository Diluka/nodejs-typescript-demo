import { Model, Sequelize, DataTypes } from 'sequelize';
import { Options, Attribute } from "sequelize-decorators";
import { Container } from 'typedi';

@Options({
    sequelize: Container.get(Sequelize)
})
export class User extends Model {

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
}
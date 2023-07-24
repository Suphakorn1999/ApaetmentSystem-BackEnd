import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt, UpdatedAt, HasMany } from "sequelize-typescript";
import { Room } from "./roomModel";
import { Users } from "./userModel";

@Table({
    timestamps: true,
    tableName: "user_detail",
})

export class UserDetail extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    iduser_detail!: number;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    iduser!: number;

    @BelongsTo(() => Users)
    users!: Users;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    fname!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    lname!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    province!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    district!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    sub_district!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    zip_code!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    age!: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    card_id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    birth_date!: string;

    @Column({
        type: DataType.STRING(10),
        allowNull: true
    })
    phone_number!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    gender!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: "active"
    })
    status_user !: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
        defaultValue: 0
    })
    deposit!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    partNameAvatar!: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    createdAt!: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    updatedAt!: Date;
}
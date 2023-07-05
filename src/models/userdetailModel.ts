import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Room } from "./roomModel";
import { Users } from "./userModel";

@Table({
    timestamps: false,
    tableName: "user_detail"
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
        allowNull: false
    })
    fname!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    lname!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    province!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    district!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    sub_district!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    zip_code!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    age!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    card_id!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    birth_date!: string;

    @Column({
        type: DataType.STRING(10),
        allowNull: false
    })
    phone_number!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    gender!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    status_user !: string;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    date_in!: string;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    date_out!: string;

    @ForeignKey(() => Room)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    idroom!: number;

    @BelongsTo(() => Room)
    room!: Room;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    createdAt!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    updatedAt!: string;
}
import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt, UpdatedAt } from "sequelize-typescript";
import { Room } from "./roomModel";
import { Users } from "./userModel";

@Table({
    timestamps: true,
    tableName: "user_room",
})

export class UserRoom extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    iduser_room!: number;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    iduser!: number;

    @BelongsTo(() => Users)
    users!: Users;

    @ForeignKey(() => Room)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    idroom!: number;

    @BelongsTo(() => Room)
    room!: Room;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    date_in!: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    date_out!: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: "active"
    })
    status!: string;
}

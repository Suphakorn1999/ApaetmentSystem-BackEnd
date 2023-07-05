import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import { UserDetail } from "./userdetailModel";
import { RoomType } from "./roomtypeModel";

@Table({
    timestamps: false,
    tableName: "room"
})

export class Room extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    idroom!: number;

    @ForeignKey(() => RoomType)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    idroom_type!: number;

    @BelongsTo(() => RoomType)
    roomtype!: RoomType;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    room_number!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "empty"
    })
    room_status!: string;

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

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "active"
    })
    status_room!: string;

    @HasMany(() => UserDetail)
    userdetail!: UserDetail[];
}
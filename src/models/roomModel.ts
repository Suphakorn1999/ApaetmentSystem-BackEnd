import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany, UpdatedAt, CreatedAt } from "sequelize-typescript";
import { UserDetail } from "./userdetailModel";
import { RoomType } from "./roomtypeModel";

@Table({
    timestamps: true,
    tableName: "room",
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

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "active"
    })
    status_room!: string;

    @HasMany(() => UserDetail)
    userdetail!: UserDetail[];
}
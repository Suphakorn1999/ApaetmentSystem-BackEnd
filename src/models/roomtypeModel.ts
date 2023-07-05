import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import { Room } from "./roomModel";

@Table({
    timestamps: false,
    tableName: "room_type"
})

export class RoomType extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    idroom_type!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    room_type_name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    room_price!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    WaterMeterprice!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    ElectricMeterprice!: string;

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
        allowNull: true,
        defaultValue: "active"
    })
    status_room_type!: string;

    @HasMany(() => Room)
    rooms!: Room[];
}
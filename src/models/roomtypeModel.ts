import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany, CreatedAt, UpdatedAt } from "sequelize-typescript";
import { Room } from "./roomModel";

@Table({
    timestamps: true,
    tableName: "room_type",
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

    @CreatedAt
    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    createdAt!: Date;

    @UpdatedAt
    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    updatedAt!: Date;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: "active"
    })
    status_room_type!: string;

    @HasMany(() => Room)
    rooms!: Room[];
}
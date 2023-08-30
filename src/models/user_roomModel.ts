import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt, UpdatedAt, HasMany } from "sequelize-typescript";
import { Room } from "./roomModel";
import { Users } from "./userModel";
import { Invoice } from "./invoiceModel";
import { Report } from "./reportModel";

@Table({
    timestamps: true,
    tableName: "user_room",
    paranoid: true,
    deletedAt: 'deleted_at',
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
        type: DataType.STRING,
        allowNull: true
    })
    deposit!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    watermeterstart!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    electricmeterstart!: number;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    date_in!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    date_out!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        defaultValue: "active"
    })
    status!: string;

    @HasMany(() => Invoice)
    invoice!: Invoice[];

    @HasMany(() => Report)
    report!: Report[];
}

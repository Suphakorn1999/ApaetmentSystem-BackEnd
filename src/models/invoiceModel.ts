import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt, HasMany } from "sequelize-typescript";
import { Users } from "./userModel";
import { Payment } from "./paymentModel";
import { UserRoom } from "./user_roomModel";

@Table({
    timestamps: true,
    tableName: "invoice",
    paranoid: true,
    deletedAt: 'deleted_at',
})

export class Invoice extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    idinvoice!: number;

    @ForeignKey(() => UserRoom)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    iduser_room!: number;

    @BelongsTo(() => UserRoom)
    user_room!: UserRoom;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    room_price!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    watermeter_old!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    watermeter_new!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    electricmeter_old!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    electricmeter_new!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    electric_price!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    water_price!: number;

    @Column({
        type: DataType.DATEONLY,
        allowNull: true,
    })
    date_invoice!: Date;

    @HasMany(() => Payment)
    payment!: Payment[];
}


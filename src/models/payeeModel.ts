import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt, HasMany } from "sequelize-typescript";
import { Op, Sequelize } from "sequelize";
import { Payment } from "./paymentModel";


@Table({
    timestamps: true,
    tableName: "payee",
    paranoid: true,
    deletedAt: 'deleted_at',
})

export class Payee extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    idpayee!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    fname_payee!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    lname_payee!: string;

    @HasMany(() => Payment)
    payment!: Payment[];
}
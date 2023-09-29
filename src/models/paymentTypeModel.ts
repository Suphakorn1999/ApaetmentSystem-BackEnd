import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt, HasMany } from "sequelize-typescript";
import { Payment } from "./paymentModel";


@Table({
    timestamps: true,
    tableName: "payment_type",
})

export class PaymentType extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    idpayment_type!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    payment_type!: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    createdAt!: Date;

    @HasMany(() => Payment)
    payment!: Payment[];
}
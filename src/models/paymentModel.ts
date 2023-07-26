import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt, HasMany } from "sequelize-typescript";
import { Invoice } from "./invoiceModel";


@Table({
    timestamps: true,
    tableName: "payment",
})

export class Payment extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    idpayment!: number;

    @ForeignKey(() => Invoice)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    idinvoice!: number;

    @BelongsTo(() => Invoice)
    invoice!: Invoice;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    payment!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    image_payment!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "pending"
    })
    payment_status!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    fname_payee!: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    lname_payee!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    note!: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    createdAt!: Date;
}

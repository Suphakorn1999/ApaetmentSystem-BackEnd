import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt, HasMany } from "sequelize-typescript";
import { Invoice } from "./invoiceModel";
import { Sequelize } from "sequelize";


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

    static async calculateMonthlyIncome(year: number): Promise<number[]> {
        const monthlyIncomes: number[] = Array(12).fill(0);

        const payments = await Payment.findAll({
            where: {
                payment_status: 'paid'
            },
            include: [
                {
                    model: Invoice,
                    where: Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('Invoice.createdAt')), year)
                }
            ]
        });

        payments.forEach(payment => {
            const paymentMonth = payment.createdAt.getMonth();
            monthlyIncomes[paymentMonth] += payment.invoice?.room_price + 
                ((payment.invoice?.watermeter_new - payment.invoice?.watermeter_old) * payment.invoice?.water_price) +
                ((payment.invoice?.electricmeter_new - payment.invoice?.electricmeter_old) * payment.invoice?.electric_price);
        });

        return monthlyIncomes;
    }
}

import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt, HasMany } from "sequelize-typescript";
import { Invoice } from "./invoiceModel";
import { Op, Sequelize } from "sequelize";
import { Payee } from "./payeeModel";
import { PaymentType } from "./paymentTypeModel";


@Table({
    timestamps: true,
    tableName: "payment",
    paranoid: true,
    deletedAt: 'deleted_at',
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

    @ForeignKey(() => PaymentType)
    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    idpayment_type!: number;

    @BelongsTo(() => PaymentType)
    paymenttype!: PaymentType;

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

    @ForeignKey(() => Payee)
    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    idpayee!: number;

    @BelongsTo(() => Payee)
    payee!: Payee;

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

    static async MonthlyIncomecount(year: number): Promise<number[]> {
        const monthlyIncomes = Array(12).fill({ paid: 0, pending: 0 });
        const payments = await Payment.findAll();

        if(payments.length === 0) return monthlyIncomes;

        for (let month = 1; month <= 12; month++) {
                const paidCount = await Payment.count({
                    where: {
                        payment_status: 'paid'
                    },
                    include: [
                        {
                            model: Invoice,
                            where: {
                                date_invoice: {
                                    [Op.and]: [
                                        Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('Invoice.date_invoice')), year),
                                        Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('Invoice.date_invoice')), month)
                                    ]
                                }
                            }
                        }
                    ]
                });

                const pendingCount = await Payment.count({
                    where: {
                        payment_status: 'pending'
                    },
                    include: [
                        {
                            model: Invoice,
                            where: {
                                date_invoice: {
                                    [Op.and]: [
                                        Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('Invoice.date_invoice')), year),
                                        Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('Invoice.date_invoice')), month)
                                    ]
                                }
                            }
                        }
                    ]
                });

                monthlyIncomes[month - 1] = {
                    month,
                    paid: paidCount,
                    pending: pendingCount
                };
        }

        return monthlyIncomes;
    }

    static async MonthlyIncome(year: number): Promise<{ month: number, paid: number, pending: number }[]> {
        const monthlyIncomes: { month: number, paid: number, pending: number }[] = Array(12).fill(0);

        for (let month = 1; month <= 12; month++) {
            const paid = await Payment.findAll({
                where: {
                    payment_status: 'paid'
                },
                include: [
                    {
                        model: Invoice,
                        where: {
                            date_invoice: {
                                [Op.and]: [
                                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('Invoice.date_invoice')), year),
                                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('Invoice.date_invoice')), month)
                                ]
                            }
                        }
                    }
                ]
            });

            const pending = await Payment.findAll({
                where: {
                    payment_status: 'pending'
                },
                include: [
                    {
                        model: Invoice,
                        where: {
                            date_invoice: {
                                [Op.and]: [
                                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('Invoice.date_invoice')), year),
                                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('Invoice.date_invoice')), month)
                                ]
                            }
                        }
                    }
                ]
            });

            monthlyIncomes[month - 1] = {
                month,
                paid: paid.reduce((sum, payment) => sum +
                    Number(payment.invoice.room_price +
                        (payment.invoice.electricmeter_new - payment.invoice.electricmeter_old) * payment.invoice.electric_price +
                        (payment.invoice.watermeter_new - payment.invoice.watermeter_old) * payment.invoice.water_price), 0),
                pending: pending.reduce((sum, payment) => sum +
                    Number(payment.invoice.room_price +
                        (payment.invoice.electricmeter_new - payment.invoice.electricmeter_old) * payment.invoice.electric_price +
                        (payment.invoice.watermeter_new - payment.invoice.watermeter_old) * payment.invoice.water_price), 0),
            };
        }

        return monthlyIncomes;
    }
}

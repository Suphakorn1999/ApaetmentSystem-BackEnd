import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt, HasMany } from "sequelize-typescript";
import { Invoice } from "./invoiceModel";
import { Op, Sequelize } from "sequelize";


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

    static async MonthlyIncomecount(year: number): Promise<number[]> {
        const monthlyIncomes = Array(12).fill(0);

        for (let month = 1; month <= 12; month++) {
            const paidCount = await Payment.count({
                where: {
                    payment_status: 'paid'
                },
                include: [
                    {
                        model: Invoice,
                        where: {
                            createdAt: {
                                [Op.and]: [
                                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('Invoice.createdAt')), year),
                                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('Invoice.createdAt')), month)
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
                            createdAt: {
                                [Op.and]: [
                                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('Invoice.createdAt')), year),
                                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('Invoice.createdAt')), month)
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
}

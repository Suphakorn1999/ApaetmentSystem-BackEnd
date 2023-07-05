import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Users } from "./userModel";

@Table({
    timestamps: false,
    tableName: "checkout"
})

export class Checkout extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    idcheckout!: number;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    checkout_date!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    status_checkout!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    checkout_description!: string;
}

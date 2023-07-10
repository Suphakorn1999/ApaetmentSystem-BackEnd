import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt } from "sequelize-typescript";
import { Users } from "./userModel";


@Table({
    timestamps: true,
    tableName: "report",
})

export class Report extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    idreport!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    report_type!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    image_report!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    report_description!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    report_status!: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    createdAt!: Date;
}
import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt, HasMany } from "sequelize-typescript";
import { Report } from "./reportModel";

@Table({
    timestamps: true,
    tableName: "report_type",
})

export class ReportType extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    idreport_type!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    report_type!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "active"
    })
    status!: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    createdAt!: Date;

    @HasMany(() => Report)
    reports!: Report[];
}
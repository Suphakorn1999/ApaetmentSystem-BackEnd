import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt } from "sequelize-typescript";
import { ReportType } from "./reporttypeModel";
import { UserRoom } from "./user_roomModel";
import { Op } from "sequelize";

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

    @ForeignKey(() => UserRoom)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    iduser_room!: number;

    @BelongsTo(() => UserRoom)
    user_room!: UserRoom;
    

    @ForeignKey(() => ReportType)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    idreport_type!: number;

    @BelongsTo(() => ReportType)
    report_type!: ReportType;

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    report_description!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "pending"
    })
    report_status!: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    createdAt!: Date;
}
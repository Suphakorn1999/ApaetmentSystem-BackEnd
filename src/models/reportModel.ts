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

    static async statisticsReportRoom(year: number): Promise<number[]> {
        const monthlyIncomes = Array(12).fill(0);

        const reportType = await ReportType.findAll();

        for (let i = 0; i < reportType.length; i++) {
            const report = await Report.findAll({
                where: {
                    createdAt: {
                        [Op.between]: [new Date(year, 0, 1), new Date(year, 11, 31)]
                    },
                    idreport_type: reportType[i].idreport_type
                }
            });
            for (let j = 0; j < report.length; j++) {
                monthlyIncomes[report[j].createdAt.getMonth()] += 1;
            }
        }

        return monthlyIncomes;
    }
}
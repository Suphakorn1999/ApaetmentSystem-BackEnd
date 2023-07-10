import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt } from "sequelize-typescript";
import { Users } from "./userModel";

@Table({
    timestamps: true,
    tableName: "invoice",
})

export class Invoice extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    idinvoice!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    room_price!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    watermeter_old!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    watermeter_new!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    electricmeter_old!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    electricmeter_new!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    electric_price!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    water_price!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    center_service_price!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    total_price!: number;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: true
    })
    createdAt!: Date;
}


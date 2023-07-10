import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Provinces } from "./provincesModel";

@Table({
    timestamps: false,
    tableName: "districts",
})

export class Districts extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    districts_id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name_th!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name_en!: string;

    @ForeignKey(() => Provinces)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    province_id!: number;

    @BelongsTo(() => Provinces)
    provinces!: Provinces;
}
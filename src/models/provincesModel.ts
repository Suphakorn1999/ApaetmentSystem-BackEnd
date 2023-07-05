import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "provinces"
})

export class Provinces extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    province_id!: number;

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
}

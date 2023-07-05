import { Table, Column, Model, DataType, BelongsTo, ForeignKey } from "sequelize-typescript";
import { Districts } from "./districtsModel";

@Table({
    timestamps: false,
    tableName: "sub_districts"
})

export class SubDistricts extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    sub_districts_id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    zip_code!: string;

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

    @ForeignKey(() => Districts)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    districts_id!: number;

    @BelongsTo(() => Districts)
    districts!: Districts;
}
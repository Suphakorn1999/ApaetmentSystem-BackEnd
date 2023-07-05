import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany } from "sequelize-typescript";
import { Users } from "./userModel";

@Table({
    timestamps: false,
    tableName: "role"
})

export class Role extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    idrole!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    role_name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    role_status!: string;

    @HasMany(() => Users)
    users!: Users[];
}
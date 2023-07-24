import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { UserDetail } from "./userdetailModel";
import { UserRoom } from "./user_roomModel";
import { Role } from "./roleModel";

@Table({
    timestamps: false,
    tableName: "users"
})

export class Users extends Model {
    [x: string]: any;
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    iduser!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    username!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password!: string;

    @ForeignKey(() => Role)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    idrole!: number;

    @BelongsTo(() => Role)
    role!: Role;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: "active"
    })
    status!: string;

    @HasMany(() => UserDetail)
    user_detail!: UserDetail[];

    @HasMany(() => UserRoom)
    user_room!: UserRoom[];
}
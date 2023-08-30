import { Table, Column, Model, DataType, HasMany, ForeignKey, BelongsTo } from "sequelize-typescript";
import { UserDetail } from "./userdetailModel";
import { UserRoom } from "./user_roomModel";
import { Role } from "./roleModel";
import { Invoice } from "./invoiceModel";
import { Report } from "./reportModel";
import { Threads } from "./threadsModel";
import { Comment } from "./commentModel";

@Table({
    timestamps: false,
    tableName: "users",
    paranoid: true,
    deletedAt: 'deleted_at',
})

export class Users extends Model {
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

    @HasMany(() => Threads)
    threads!: Threads[];

    @HasMany(() => Comment)
    comment!: Comment[];
}
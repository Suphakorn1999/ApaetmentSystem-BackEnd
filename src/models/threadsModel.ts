import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt, HasMany } from "sequelize-typescript";
import { Users } from "./userModel";
import { Posts } from "./postsModel";

@Table({
    timestamps: true,
    tableName: "threads",
    paranoid: true,
    deletedAt: 'deleted_at',
})

export class Threads extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    idthreads!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    title!: string;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    iduser!: number;


    @BelongsTo(() => Users)
    user!: Users;

    @CreatedAt
    created_at!: Date;

    @HasMany(() => Posts)
    posts!: Posts[];
}

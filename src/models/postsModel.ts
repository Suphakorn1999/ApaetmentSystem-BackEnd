import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt, HasMany } from "sequelize-typescript";
import { Users } from "./userModel";
import { Threads } from "./threadsModel";
import { Comment } from "./commentModel";

@Table({
    timestamps: true,
    tableName: "posts",
    paranoid: true,
    deletedAt: 'deleted_at',
})

export class Posts extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    idposts!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    content!: string;

    @ForeignKey(() => Users)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    iduser!: number;

    @BelongsTo(() => Users)
    user!: Users;

    @ForeignKey(() => Threads)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    idthreads!: number;

    @BelongsTo(() => Threads)
    threads!: Threads;

    @CreatedAt
    created_at!: Date;

    @HasMany(() => Comment)
    comment!: Comment[];
}
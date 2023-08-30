import { Table, Column, Model, DataType, BelongsTo, ForeignKey, CreatedAt } from "sequelize-typescript";
import { Users } from "./userModel";
import { Posts } from "./postsModel";

@Table({
    timestamps: true,
    tableName: "comment",
    paranoid: true,
    deletedAt: 'deleted_at',
})

export class Comment extends Model {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    })
    idcomment!: number;

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

    @ForeignKey(() => Posts)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    idposts!: number;

    @BelongsTo(() => Posts)
    posts!: Posts;

    @CreatedAt
    created_at!: Date;
}
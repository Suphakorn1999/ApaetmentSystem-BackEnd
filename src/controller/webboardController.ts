import { RequestHandler } from 'express';
import { Users } from '../models/userModel';
import { Threads } from '../models/threadsModel';
import { Posts } from '../models/postsModel';
import { Comment } from '../models/commentModel';
import { UserDetail } from '../models/userdetailModel';
import { Op } from 'sequelize';

export const getThreads: RequestHandler = async (req, res, next) => {
    try {
        const data: object[] = [];
        const threads = await Threads.findAll({
            include: [
                {
                    model: Users,
                    attributes: ["iduser"],
                    include: [
                        {
                            model: UserDetail,
                            attributes: ["fname", "lname", "partNameAvatar"]
                        }
                    ]
                },
                {
                    model: Posts,
                    include: [
                        {
                            model: Users,
                            attributes: ["iduser"]
                        },
                        {
                            model: Comment,
                            include: [
                                {
                                    model: Users,
                                    attributes: ["iduser"]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        threads.forEach((thread: any) => {
            data.push({
                idthreads: thread.idthreads,
                title: thread.title,
                created_at: thread.created_at,
                updatedAt: thread.updatedAt,
                fname: thread.user.user_detail[0]?.fname,
                lname: thread.user.user_detail[0]?.lname,
                partNameAvatar: thread.user.user_detail[0]?.partNameAvatar,
                iduser: thread.user.iduser,
            })
        });

        return res.status(200).json({ data: data });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getThread: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const thread = await Threads.findByPk(id, {
            include: [
                {
                    model: Users,
                    attributes: ["iduser"],
                    include: [
                        {
                            model: UserDetail,
                            attributes: ["fname", "lname", "partNameAvatar"]
                        }
                    ]
                },
                {
                    model: Posts,
                    include: [
                        {
                            model: Users,
                            attributes: ["iduser"]
                        },
                        {
                            model: Comment,
                            include: [
                                {
                                    model: Users,
                                    attributes: ["iduser"]
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        return res.status(200).json({ data: thread });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getPostAndCommentByidthreads: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data: object[] = [];
        const post = await Posts.findAll({
            where: { idthreads: id },
            include: [
                {
                    model: Users,
                    attributes: ["iduser"],
                    include: [
                        {
                            model: UserDetail,
                            attributes: ["fname", "lname", "partNameAvatar"]
                        }
                    ]
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: Users,
                            attributes: ["iduser"],
                            include: [
                                {
                                    model: UserDetail,
                                    attributes: ["fname", "lname", "partNameAvatar"]
                                }
                            ]
                        }
                    ],
                }
            ]
        });
        post.forEach((post: any, index: number) => {
            data.push({
                idposts: post.idposts,
                content: post.content,
                created_at: post.created_at,
                updatedAt: post.updatedAt,
                fname: post.user.user_detail[0].fname,
                lname: post.user.user_detail[0].lname,
                partNameAvatar: post.user.user_detail[0].partNameAvatar,
                iduser: post.user.iduser,
                comments: post.comment && post.comment.map((comment: any, index: number) => {
                    return {
                        idcomment: comment.idcomment,
                        content: comment.content,
                        created_at: comment.created_at,
                        updatedAt: comment.updatedAt,
                        fname: comment.user.user_detail[0]?.fname,
                        lname: comment.user.user_detail[0]?.lname,
                        partNameAvatar: comment.user.user_detail[0]?.partNameAvatar,
                        iduser: comment.user.iduser
                    }
                })
            })
        });
        return res.status(200).json({ data: data });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const createThread: RequestHandler = async (req, res, next) => {
    try {
        const { title } = req.body;
        const iduser = req.body.user.id;
        const thread = await Threads.create({ title: title, iduser: iduser });

        return res.status(200).json({ data: thread });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const createPost: RequestHandler = async (req, res, next) => {
    try {
        const { content, idthreads } = req.body;
        const iduser = req.body.user.id;
        const post = await Posts.create({ content: content, iduser: iduser, idthreads: idthreads });

        return res.status(200).json({ data: post });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const createComment: RequestHandler = async (req, res, next) => {
    try {
        const { content, idposts } = req.body;
        const iduser = req.body.user.id;
        const comment = await Comment.create({ content: content, iduser: iduser, idposts: idposts });

        return res.status(200).json({ data: comment });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const updateThread: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const thread = await Threads.update({ title }, { where: { idthreads: id } });

        return res.status(200).json({ data: thread });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const updatePost: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const post = await Posts.update({ content }, { where: { idposts: id } });

        return res.status(200).json({ data: post });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const updateComment: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const comment = await Comment.update({ content }, { where: { idcomment: id } });

        return res.status(200).json({ data: comment });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getCommentByidposts: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findAll({ where: { idposts: id } });

        return res.status(200).json({ data: comment });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getSearchedThread: RequestHandler = async (req, res, next) => {
    try {
        const { title } = req.params;
        const data: object[] = [];
        const threads = await Threads.findAll({
            include: [
                {
                    model: Users,
                    attributes: ["iduser"],
                    include: [
                        {
                            model: UserDetail,
                            attributes: ["fname", "lname", "partNameAvatar"]
                        }
                    ]
                },
                {
                    model: Posts,
                    include: [
                        {
                            model: Users,
                            attributes: ["iduser"]
                        },
                        {
                            model: Comment,
                            include: [
                                {
                                    model: Users,
                                    attributes: ["iduser"]
                                }
                            ]
                        }
                    ]
                }
            ],
            where: {
                title: {
                    [Op.like]: `%${title}%`
                }
            }
        });

        threads.forEach((thread: any) => {
            data.push({
                idthreads: thread.idthreads,
                title: thread.title,
                created_at: thread.created_at,
                updatedAt: thread.updatedAt,
                fname: thread.user.user_detail[0]?.fname,
                lname: thread.user.user_detail[0]?.lname,
                partNameAvatar: thread.user.user_detail[0]?.partNameAvatar,
                iduser: thread.user.iduser,
            })
        });

        return res.status(200).json({ data: data });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const deleteComment: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await Comment.destroy({ where: { idcomment: id } });

        return res.status(200).json({ data: comment });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const deletePost: RequestHandler = async (req, res, next) => {
    const t = await Posts.sequelize?.transaction();
    try {
        const { id } = req.params;
        const post = await Posts.destroy({ where: { idposts: id }, transaction: t });
        const comment = await Comment.destroy({ where: { idposts: id }, transaction: t });

        await t?.commit();
        return res.status(200).json({ data: post, comment: comment });
    } catch (err: any) {
        await t?.rollback();
        return res.status(500).json({ message: err.message });
    }
}

export const deleteThread: RequestHandler = async (req, res, next) => {
    const t = await Threads.sequelize?.transaction();
    try {
        const { id } = req.params;
        const thread = await Threads.destroy({ where: { idthreads: id }, transaction: t });
        const post = await Posts.destroy({ where: { idthreads: id }, transaction: t });
        const comment = await Comment.destroy({ where: { idthreads: id }, transaction: t });

        await t?.commit();
        return res.status(200).json({ data: thread, post: post, comment: comment });
    } catch (err: any) {
        await t?.rollback();
        return res.status(500).json({ message: err.message });
    }
}

export const getSearchedPost: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.params;
        const data: object[] = [];
        const post = await Posts.findAll({
            where: {
                idthreads: id,
                content: {
                    [Op.like]: `%${content}%`
                }
            },
            include: [
                {
                    model: Users,
                    attributes: ["iduser"],
                    include: [
                        {
                            model: UserDetail,
                            attributes: ["fname", "lname", "partNameAvatar"]
                        }
                    ]
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: Users,
                            attributes: ["iduser"],
                            include: [
                                {
                                    model: UserDetail,
                                    attributes: ["fname", "lname", "partNameAvatar"]
                                }
                            ]
                        }
                    ],
                }
            ],
        });

        post.forEach((post: any, index: number) => {
            data.push({
                idposts: post.idposts,
                content: post.content,
                created_at: post.created_at,
                updatedAt: post.updatedAt,
                fname: post.user.user_detail[0].fname,
                lname: post.user.user_detail[0].lname,
                partNameAvatar: post.user.user_detail[0].partNameAvatar,
                iduser: post.user.iduser,
                comments: post.comment && post.comment.map((comment: any, index: number) => {
                    return {
                        idcomment: comment.idcomment,
                        content: comment.content,
                        created_at: comment.created_at,
                        updatedAt: comment.updatedAt,
                        fname: comment.user.user_detail[0]?.fname,
                        lname: comment.user.user_detail[0]?.lname,
                        partNameAvatar: comment.user.user_detail[0]?.partNameAvatar,
                        iduser: comment.user.iduser
                    }
                })
            })
        });
        return res.status(200).json({ data: data });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}
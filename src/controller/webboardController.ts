import { RequestHandler } from 'express';
import { Users } from '../models/userModel';
import { Threads } from '../models/threadsModel';
import { Posts } from '../models/postsModel';
import { Comment } from '../models/commentModel';
import { UserDetail } from '../models/userdetailModel';
import { Op } from 'sequelize';

export const getThreads: RequestHandler = async (req, res, next) => {
    try {
        const threads = await Threads.findAll({
            include: [
                {
                    model: Users,
                    attributes: ["iduser"],
                    include: [
                        {
                            model: UserDetail,
                            attributes: ["fname", "lname"]
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

        return res.status(200).json({ data: threads });
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
                            attributes: ["fname", "lname"]
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

export const getPost: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const post = await Posts.findByPk(id, {
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
        });

        return res.status(200).json({ data: post });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const getComment: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findByPk(id, {
            include: [
                {
                    model: Users,
                    attributes: ["iduser"]
                }
            ]
        });

        return res.status(200).json({ data: comment });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const createThread: RequestHandler = async (req, res, next) => {
    try {
        const { title, iduser } = req.body;
        const thread = await Threads.create({ title, iduser });

        return res.status(200).json({ data: thread });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const createPost: RequestHandler = async (req, res, next) => {
    try {
        const { content, iduser, idthreads } = req.body;
        const post = await Posts.create({ content, iduser, idthreads });

        return res.status(200).json({ data: post });
    } catch (err: any) {
        return res.status(500).json({ message: err.message });
    }
}

export const createComment: RequestHandler = async (req, res, next) => {
    try {
        const { content, iduser, idposts } = req.body;
        const comment = await Comment.create({ content, iduser, idposts });

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

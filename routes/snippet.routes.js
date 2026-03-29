import express from 'express'
import { prisma } from '../db/prismaClient';

const router = express.Router();

//Get snippets for displaying in dashboard
//Body: null, response {id, title, updatedAt}
router.get("/fetchAll", async (req, res) => {
    const userid = req.user.userId;
    const snippets = await prisma.snippet.findMany({
        where: { userId: userid },
        select: {
            id: true,
            title: true,
            updatedAt: true,
        }
    });

    return res.status(200).json(snippets);
});

//Get individual snippet data to display in the editor
//Body: null, response - entire snippet entity
router.get("/:snippetId", async (req, res) => {
    const snippetid = req.params['snippetId'];

    const snippet = await prisma.snippet.findFirst({
        where: { id: snippetid , userId: req.user.userId }
    });

    if (!snippet) return res.status(404).json({error: "No such snippet"});

    return res.status(200).json(snippet);
});

// Update snippet on id
router.put("/:snippetId", async (req, res) => {
    const snippetId = req.params['snippetId'];

    try {
        const snippet = await prisma.snippet.updateMany({
            where: { id: snippetId, userId: req.user.userId },
            data: {
                title: req.body.title,
                language: req.body.language,
                code: req.body.code,
                notes: req.body.notes
            }
        });

        return res.status(200).json(snippet);
    }
    catch (err) {
        if (err.code === 'P2025') return res.status(404).json({error: "Not found!"})
        return res.status(500).json({error: "Unexpected error at server side, please try later"});
    }

});

// Create new snippet
router.post("/", async (req, res) => {
    try {
        const snippet = await prisma.snippet.create({
            data: {
                title: req.body.title,
                language: req.body.language,
                code: req.body.code,
                notes: req.body.notes,
                userId: req.user.userId
            }
        });

        return res.status(201).json(snippet);
    }

    catch (err) {
        return res.status(500).json({error: "Error creating a new snippet"});
    }
});

// Delete using snippetId
router.delete("/:snippetId", async (req, res) => {
    try {
        const deletedSnippet = await prisma.snippet.deleteMany({
            where: {
                id: req.params['snippetId'],
                userId: req.user.userId
            }
        });

        return res.status(200).json({message: "Deleted successfully!"});
    }
    catch (err) {
        if (err.code === 'P2025') return res.status(404).json({error: "Snippet doesn't exist!"});
        return res.status(500).json({error: "Error deleting the snippet"});
    }
});

export default router;

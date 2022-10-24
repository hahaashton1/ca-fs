import prisma from "../../lib/prisma";

export default async (req, res) => {

    try {
        // get user based on utcode
        const user = await prisma.grant.findMany({
            where: {
                //utcode: req.query.utcode
                //utcode: "UT46YV0"
                utcode: { in: req.query.utcode }
            },
            select: {
                utcode: true,
                application: true,
                profile: true,
            }
        })
        res.status(200).json(user);
    }
    catch (err) {
        console.error(err);
        res.status(403).json({ err: "Error occured while trying to get user data!" });
    }
}
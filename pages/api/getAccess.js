import prisma from '../../lib/prisma';

export default async (req, res) => {
    const data = req.body;
    try {
    //   const result = await prisma.grant.create({
    //     data: {
    //       ...data,
    //     },
    //   });

      const result = await prisma.grant.findMany()

      res.status(200).json(result);
    } 
    
    catch (err) {
      console.log(err);
      res.status(403).json({ err: "Error occured while trying to get grants" });
    }
  };



// Path: pages/api/getAccesses.js




import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { db } = await connectToDatabase();
        const items = await db.collection('inventory').find({}).toArray();
        res.status(200).json(items);
      } catch (error) {
        res.status(500).json({ error: 'Error fetching inventory items' });
      }
      break;

    case 'POST':
      try {
        const { db } = await connectToDatabase();
        const { name, quantity, price } = req.body;
        const result = await db.collection('inventory').insertOne({ name, quantity, price });
        res.status(201).json(result);
      } catch (error) {
        res.status(500).json({ error: 'Error adding inventory item' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
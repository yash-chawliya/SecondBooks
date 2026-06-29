import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import { BSON } from 'bson';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backupDir = path.join(__dirname, '../db_backup');

const restore = async () => {
  try {
    const uri = process.env.MONGO_URI;
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected!');

    const files = fs.readdirSync(backupDir);
    const bsonFiles = files.filter(f => f.endsWith('.bson'));

    for (const file of bsonFiles) {
      const collectionName = file.replace('.bson', '');
      console.log(`Processing collection: ${collectionName}`);
      
      const filePath = path.join(backupDir, file);
      const data = fs.readFileSync(filePath);
      
      const documents = [];
      let offset = 0;
      
      while (offset < data.length) {
        // Read the size of the next document (first 4 bytes)
        const size = data.readInt32LE(offset);
        const docBuffer = data.subarray(offset, offset + size);
        
        // Deserialize the document
        const doc = BSON.deserialize(docBuffer);
        documents.push(doc);
        
        offset += size;
      }
      
      if (documents.length > 0) {
        // Insert into the database
        const db = mongoose.connection.db;
        const collection = db.collection(collectionName);
        
        // Drop existing collection to ensure a clean restore
        try {
            await collection.drop();
            console.log(`  Dropped existing collection ${collectionName}`);
        } catch (e) {
            // Collection might not exist, ignore error
        }
        
        await collection.insertMany(documents);
        console.log(`  Restored ${documents.length} documents into ${collectionName}`);
      } else {
        console.log(`  No documents found in ${file}`);
      }
    }

    console.log('\nRestore complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during restore:', error);
    process.exit(1);
  }
};

restore();

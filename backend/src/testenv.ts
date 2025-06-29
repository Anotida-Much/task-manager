import dotenv from 'dotenv';
dotenv.config();
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);


dotenv.config({ path: __dirname + '/../.env' });
console.log('DB_PASSWORD:', { path: __dirname + '/../.env' });
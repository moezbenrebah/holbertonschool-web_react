import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as appSchema from './appSchema';
import * as authSchema from './authSchema';

// Configuration de dotenv
dotenv.config();

// Vérification des variables d'environnement
if (!process.env.DATABASE_HOST || !process.env.DATABASE_USERNAME || !process.env.DATABASE_PASSWORD || !process.env.DATABASE_NAME) {
	throw new Error('Variables d\'environnement de base de données manquantes');
}

// Creation du pool de connection
const poolConnection = mysql.createPool({
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: process.env.DATABASE_NAME,
	// Configuration du pool optimisée
	connectionLimit: 20, // Augmenté pour gérer plus de connexions
	maxIdle: 10,        // Garde 10 connexions inactives max
	idleTimeout: 60000, // Timeout après 1 minute d'inactivité
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
	waitForConnections: true, // Met en file d'attente les connexions si la limite est atteinte
	queueLimit: 0,     // Pas de limite de file d'attente
});

let activeConnections = 0;

poolConnection.on('acquire', () => {
	activeConnections++;
	console.log(`Connexion acquise. Actives: ${activeConnections}`);
});

poolConnection.on('release', () => {
	activeConnections--;
	console.log(`Connexion libérée. Actives: ${activeConnections}`);
});

poolConnection.on('enqueue', () => {
	console.error(`Pool saturé! Connexions actives: ${activeConnections}`);
});

// Test de la connexion
poolConnection.getConnection()
	.then(connection => {
		console.log('✅ Connexion à la base de données établie');
		connection.release();
	})
	.catch(err => {
		console.error('❌ Erreur de connexion à la base de données:', err);
		throw err;
	});

// export de la connection
export const db = drizzle(poolConnection, {
	schema: {
		...appSchema,
		...authSchema
	},
	mode: 'default',
	logger: true
});

// Exporter le pool de connexion
export const pool = poolConnection;

// Mauvaise pratique (connexion pas libérée)
export const getData = async (query: string) => {
	const connection = await poolConnection.getConnection();
	const [result] = await connection.execute(query);
	return result;
	// Pas de connection.release() !
}

// Bonne pratique
export const getDataSafe = async (query: string) => {
	const connection = await poolConnection.getConnection();
	try {
		const [result] = await connection.execute(query);
		return result;
	} finally {
		connection.release(); // Important !
	}
}

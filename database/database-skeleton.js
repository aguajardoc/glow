// Require Sequelize
const Sequelize = require('sequelize');
// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

/* Table that stores user information.
 * equivalent to: CREATE TABLE users(
 * idUser INT NOT NULL AUTO_INCREMENT
 * handle VARCHAR(255) UNIQUE,
 * idGitGud INT,
 * idLadder INT,
 * idVc  INT,
 *  PRIMARY KEY (idUser),
    FOREIGN KEY (idGitGud) REFERENCES gitgud_user(idGitGud),
    FOREIGN KEY (idLadder) REFERENCES ladder_user(idLadder),
    FOREIGN KEY (idVc) REFERENCES vc_user(idVc)
 * );
 */
const Users = sequelize.define('users', {
	idUser: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		allowNull: false,
	},
	handle: {
		type: DataTypes.STRING(255),
		unique: true,
		allowNull: false,
	},
	idGitGud: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: {
			model: 'gitgud_user',
			key: 'idGitGud',
		},
		onUpdate: 'CASCADE',
		onDelete: 'SET NULL',
	},
	idLadder: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: {
			model: 'ladder_user',
			key: 'idLadder',
		},
		onUpdate: 'CASCADE',
		onDelete: 'SET NULL',
	},
	idVc: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: {
			model: 'vc_user',
			key: 'idVc',
		},
		onUpdate: 'CASCADE',
		onDelete: 'SET NULL',
	},
});


// When the client is ready, run this code (only once)
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;
	// ...
});

// Login to Discord with your client's token
client.login('your-token-goes-here');

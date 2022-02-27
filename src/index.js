const { ApolloServer, gql } = require('apollo-server');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();
const { DB_URI, DB_NAME } = process.env; //Connect with Client
process.env.DB_URI;

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
	# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
	# The "Query" type is special: it lists all of the available queries that
	# clients can execute, along with the return type for each. In this
	# case, the "books" query returns an array of zero or more Books (defined above).
	type Query {
		myTaskLists: [TaskList!]!
	}
	type Mutation {
		signUp(input: SignUpInput): AuthUser!
		signIn(input: SignInInput): AuthUser!
	}
	input SignUpInput {
		email: String!
		password: String!
		name: String!
		avatar: String
	}
	input SignInInput {
		email: String!
		password: String!
	}
	type AuthUser {
		user: User!
		token: String!
	}
	type User {
		id: ID!
		user: String!
		name: String!
		email: String!
		avatar: String
	}
	type TaskList {
		id: ID!
		createAt: String!
		title: String!
		progress: Float!
		# Array of Users (Importance for User and Array)
		user: [User!]!
		# todos
	}
	type ToDo {
		id: ID!
		content: String!
		isComplete: Boolean!
		taskListId: ID!
		taskList: TaskList!
	}
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
	Query: {
		myTaskLists: () => [],
	},
	Mutation: {
		// (root, data, context)
		signUp: async (_, { input }, { db }) => {
			// console.log(input); // Will contain everything From input

			const hashedPassword = bcrypt.hashSync(input.password);
			// console.log(hashedPassword); // One Way Hashing

			const newUser = {
				...input,
				pasword: hashedPassword,
			};

			// save to database
			const result = await db.collection('Users').insertOne(newUser);
			// console.log(result); // shows whats being send to the data base

			// Alternative way to get recent inserted object
			id = result.insertedId;
			const fetched = await db.collection('Users').findOne(id);
			return {
				user: fetched,
				token: 'placeholder token until get to vid part',
			};
		},

		signIn: () => {},
	},

	// Fix Error: MongoDB returns User._id
	// need User.id (no _)
	User: {
		// id: (root) => {     // your choice to destructur it

		// id: ({ _id, id }) => {
		// 	// your choice to destructur it
		// 	// console.log(root);
		// 	// return root._id; // Getting _id with just id
		// },

		// Simpler Way
		id: ({ _id, id }) => _id || id, // Return either _id  or id if not null
	},
};

const start = async () => {
	const client = new MongoClient(DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverApi: ServerApiVersion.v1,
	});

	await client.connect();
	const db = client.db(DB_NAME); // Easier to access all the tables

	const context = {
		db,
	};

	// The ApolloServer constructor requires two parameters: your schema
	// definition and your set of resolvers.
	const server = new ApolloServer({ typeDefs, resolvers, context });

	// The `listen` method launches a web server.
	server.listen().then(({ url }) => {
		console.log(`🚀  Server ready at ${url}`);
	});
};

start();

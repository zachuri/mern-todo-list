const { ApolloServer, gql } = require('apollo-server');
const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
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

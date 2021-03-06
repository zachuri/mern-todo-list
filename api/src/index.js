const { ApolloServer, gql } = require('apollo-server');
const { MongoClient, ServerApiVersion, ObjectID } = require('mongodb');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();
const { DB_URI, DB_NAME, JWT_SECRET } = process.env; // Connect with Client

console.log(DB_URI);
console.log(DB_NAME);
console.log(JWT_SECRET);

const getToken = (user) =>
	jwt.sign(
		{
			id: user._id,
		},
		JWT_SECRET,
		{ expiresIn: '7 days' } // Causes user to resign in
	);

const getUserFromToken = async (token, db) => {
	if (!token) {
		return null;
	}
	const tokenData = jwt.verify(token, JWT_SECRET);

	if (!tokenData?.id) {
		// "?" -> check if undefind (id is undefined)
		// "!" -> check it's false (empty)
		return null;
	}

	return await db.collection('Users').findOne({ _id: ObjectID(tokenData.id) });
};

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
		getTaskList(id: ID!): TaskList
	}

	type Mutation {
		signUp(input: SignUpInput): AuthUser!
		signIn(input: SignInInput): AuthUser!

		createTaskList(title: String!): TaskList!
		updateTaskList(id: ID!, title: String!): TaskList!
		deleteTaskList(id: ID!): Boolean!
		addUserToTaskList(taskListId: ID!, userId: ID!): TaskList

		createToDo(content: String!, taskListId: ID!): ToDo!
		updateToDo(id: ID!, content: String, isCompleted: Boolean): ToDo!
		deleteToDo(id: ID!): Boolean!
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
		createdAt: String!
		title: String!
		progress: Float!
		# Array of Users (Importance for User and Array)
		users: [User!]!
		todos: [ToDo!]!
	}

	type ToDo {
		id: ID!
		content: String!
		isCompleted: Boolean!
		taskListId: ID!
		taskList: TaskList!
	}
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
	Query: {
		// Query that shows the task list
		// async (_, __, context) 2nd param has double underscore
		myTaskLists: async (_, __, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}

			return await db
				.collection('TaskList')
				.find({ userIds: user._id })
				.toArray();
		},

		// Query that gets a task list with an ID
		getTaskList: async (_, { id }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}

			return await db.collection('TaskList').findOne({ _id: ObjectID(id) });
		},
	},
	Mutation: {
		// (root, data, context)
		signUp: async (_, { input }, { db }) => {
			// console.log(input); // Will contain everything From input

			const hashedPassword = bcrypt.hashSync(input.password);
			// console.log(hashedPassword); // One Way Hashing

			const newUser = {
				...input,
				password: hashedPassword,
			};

			// save to database
			const result = await db.collection('Users').insertOne(newUser);
			// console.log(result); // shows whats being send to the data base

			// Alternative way to get recent inserted object
			id = result.insertedId;
			const fetched = await db.collection('Users').findOne(id);

			// console.log(fetched);

			return {
				user: fetched,
				token: 'token',
			};
		},

		signIn: async (_, { input }, { db }) => {
			const user = await db
				.collection('Users')
				.findOne({ email: input.email });

			// check if password is correct
			const isPasswordCorrect =
				user && // check if user is undefined
				bcrypt.compareSync(
					input.password, // compare unhashed password
					user.password || '' // check if password empty or compare hashed pass
				);

			// console.log(user); //If user is NULL-> doesn't exist

			if (!user || !isPasswordCorrect) {
				// Never specify the error (data breach)
				// Will give too much info to hackers
				// E.g. ___ doesn't exist
				throw new Error('Invalid credentials!');
			}

			return {
				user,
				token: getToken(user), // User with a token for Resign in
				// Encrypted token (saved on local storage)
			};
		},

		createTaskList: async (_, { title }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}

			const newTaskList = {
				title,
				createdAt: new Date().toISOString(),
				userIds: [user._id],
			};

			// save to database
			const result = await db.collection('TaskList').insertOne(newTaskList);
			// console.log(result); // shows whats being send to the data base

			// Alternative way to get recent inserted object
			id = result.insertedId;
			const fetched = await db.collection('TaskList').findOne(id);
			// console.log(fetched);

			const { _id, createdAt, userIds } = fetched;

			return {
				_id,
				createdAt,
				title,
				userIds,
			};
		},

		// Updated the task list with the user and id, title of the task
		updateTaskList: async (_, { id, title }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}
			const result = await db
				.collection('TaskList')
				.updateOne({ _id: ObjectID(id) }, { $set: { title: title } }); // use set if you want to update one field
			id = result.insertedId;

			const fetched = await db.collection('TaskList').findOne(id);
			return fetched;
		},

		// Delete a TaskList from Tasklist Collection with the same ID
		deleteTaskList: async (_, { id }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}
			// TODO only collaborators of this taks list should be able to delete
			await db.collection('TaskList').deleteOne({ _id: ObjectID(id) });

			return true;
		},

		// Add a user to the task list by adding an id to the UserID array
		addUserToTaskList: async (_, { taskListId, userId }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}

			const taskList = await db
				.collection('TaskList')
				.findOne({ _id: ObjectID(taskListId) }); // use set if you want to update one field

			// if taskList doesn't exist return null
			if (!taskList) {
				return null;
			}

			// Check if user is already in side (return the original taskList)
			if (
				taskList.userIds.find(
					(dbID) => dbID.toString() === userId.toString()
				)
			) {
				return taskList;
			}

			// If all true, add user to the task list with all the other users (array)
			await db
				.collection('TaskList')
				.updateOne(
					{ _id: ObjectID(taskListId) },
					{ $push: { userIds: ObjectID(userId) } }
				); // use push to add to array
			taskList.userIds.push(ObjectID(userId));
			return taskList;
		},

		// ToDo Items
		createToDo: async (_, { content, taskListId }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}

			const newToDo = {
				content,
				taskListId: ObjectID(taskListId),
				isCompleted: false,
			};

			// save to database
			const result = await db.collection('ToDo').insertOne(newToDo);
			// console.log(result); // shows whats being send to the data base

			// Alternative way to get recent inserted object
			id = result.insertedId;
			const fetched = await db.collection('ToDo').findOne(id);
			// console.log(fetched);

			const { isCompleted } = fetched;
			return {
				id,
				content,
				isCompleted,
				taskListId,
			};
		},

		// Updated the task list with the user and id, title of the task
		updateToDo: async (_, data, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}

			// This updates the data e.g (content/isCompleted) with a specific id
			await db
				.collection('ToDo')
				.updateOne({ _id: ObjectID(data.id) }, { $set: data }); // use set if you want to update one field

			return await db.collection('ToDo').findOne({ _id: ObjectID(data.id) });
		},

		// Delete an item from the task list with the same ID
		deleteToDo: async (_, { id }, { db, user }) => {
			if (!user) {
				throw new Error('Authentication Error. Please Sign In');
			}
			// TODO only collaborators of this taks list should be able to delete
			await db.collection('ToDo').deleteOne({ _id: ObjectID(id) });

			return true;
		},
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

	TaskList: {
		id: ({ _id, id }) => _id || id, // Return either _id  or id if not null

		// This object is to return the tasklist progress percentage of completed
		progress: async ({ _id }, _, { db }) => {
			const todos = await db
				.collection('ToDo')
				.find({ taskListId: ObjectID(_id) })
				.toArray();

			const completed = todos.filter((todo) => todo.isCompleted);

			if (todos.length === 0) {
				return 0;
			}

			return (100 * completed.length) / todos.length;
		},

		users: async ({ userIds }, _, { db }) =>
			Promise.all(
				userIds.map((userId) =>
					db.collection('Users').findOne({ _id: userId })
				)
			),

		// connected Todo with TaskList
		todos: async ({ _id }, _, { db }) =>
			await db
				.collection('ToDo')
				.find({ taskListId: ObjectID(_id) })
				.toArray(),
	},

	ToDo: {
		id: ({ _id, id }) => _id || id, // Return either _id  or id if not null
		taskList: async ({ taskListId }, _, { db }) =>
			await db.collection('TaskList').findOne({ _id: ObjectID(taskListId) }),
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

	// The ApolloServer constructor requires two parameters: your schema
	// definition and your set of resolvers.
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: async ({ req }) => {
			// Decode token and add the user to Conext

			// console.log(req.headers);
			const user = await getUserFromToken(req.headers.authorization, db);
			// console.log(user);

			return {
				db,
				user,
			};
		},
	});

	// The `listen` method launches a web server.
	server.listen().then(({ url }) => {
		console.log(`????  Server ready at ${url}`);
	});
};

start();

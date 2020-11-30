// Import the mock library
// @ts-ignore
const SequelizeMock = require( "sequelize-mock" );

// Setup the mock database connection
const DBConnectionMock = new SequelizeMock();

// Define our Model
const User = DBConnectionMock.define( "users", {
    "id": "937f7e15-089f-413a-9c11-86a85da4b2e7",
    "login": "Test8",
    "password": "test8",
    "age": 24,
    "isDeleted": false,
}, {
    instanceMethods: {
        myTestFunc: function () {
            return "Test User";
        },
    },
} );

// You can also associate mock models as well
const Group = DBConnectionMock.define( "groups", {
    "id": "350901ff-b683-4b59-84b0-af431652c901",
    "name": "Admins",
    "permissions": [
        "READ",
        "WRITE",
        "DELETE",
        "SHARE",
        "UPLOAD_FILES"
    ],
} );

User.belongsToMany(Group, { through: 'UserGroup', onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true });
Group.belongsToMany(User, { through: 'UserGroup', onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true });

// From there we can start using it like a normal model
User.findOne({
    where: {
        username: 'my-user',
    },
}).then(function (user: any) {
    // `user` is a Sequelize Model-like object
    user.get('id');         // Auto-Incrementing ID available on all Models
    user.get('email');      // 'email@example.com'; Pulled from default values
    user.get('username');   // 'my-user'; Pulled from the `where` in the query

    user.myTestFunc();      // Will return 'Test User' as defined above

    user.getGroup();        // Will return a `GroupMock` object
});

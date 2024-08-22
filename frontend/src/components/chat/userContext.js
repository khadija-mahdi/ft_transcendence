// userContext.js
export const userContext = (() => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
	console.log('users:', users);

    const subscribers = [];

    const subscribe = (callback) => {
        subscribers.push(callback);
    };

    const notifySubscribers = () => {
        subscribers.forEach(callback => callback());
    };

    const addUser = (user) => {
        if (user && user.id) {
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            notifySubscribers();
        }
    };

    const removeUser = (userId) => {
        users = users.filter(user => user.id !== userId);
        localStorage.setItem('users', JSON.stringify(users));
        notifySubscribers();
    };
	const getUsers = () => users;

    return {
        subscribe,
        addUser,
        removeUser,
		getUsers,
        getState: () => ({ users })
    };
})();

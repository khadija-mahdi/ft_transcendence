

export const userContext = (() => {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let group_name = JSON.parse(localStorage.getItem('group_name')) || '';
    let group_image = localStorage.getItem('group_image') || null;

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

    const setGroupName = (group) => {
        group_name = group;
        localStorage.setItem('group_name', JSON.stringify(group_name));
        notifySubscribers();
    };

    const setGroupImage = (image) => {
        const reader = new FileReader();
        reader.onload = () => {
            group_image = reader.result; 
            localStorage.setItem('group_image', group_image);
            notifySubscribers();
        };
        reader.readAsDataURL(image);
    };

    const RemoveGroupName = () => {
        group_name = '';
        localStorage.setItem('group_name', JSON.stringify(group_name));
        notifySubscribers();
    };

    const RemoveGroupImage = () => {
        group_image = '';
        localStorage.removeItem('group_image');
        notifySubscribers();
    };

    const getUsers = () => users;

    const getGroupName = () => group_name;

    const getGroupImage = () => group_image;

    return {
        subscribe,
        addUser,
        removeUser,
        setGroupName,
        setGroupImage,
        RemoveGroupName,
        RemoveGroupImage,
        getUsers,
        getGroupName,
        getGroupImage,
        getState: () => ({ users })
    };
})();

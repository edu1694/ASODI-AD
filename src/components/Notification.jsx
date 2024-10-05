import React from 'react';

const Notification = ({ message, type }) => {
    if (!message) return null;

    let backgroundColor = '';
    if (type === 'error') {
        backgroundColor = 'bg-red-500';
    } else if (type === 'success') {
        backgroundColor = 'bg-green-500';
    }

    return (
        <div className={`fixed top-5 right-5 p-4 rounded-md shadow-md text-white ${backgroundColor}`}>
            {message}
        </div>
    );
};

export default Notification;

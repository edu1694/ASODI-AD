import React from 'react';

const Modal = ({ onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold">Editar Usuario</h3>
                    <button onClick={onClose} className="text-gray-700 font-bold">&times;</button>
                </div>
                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;

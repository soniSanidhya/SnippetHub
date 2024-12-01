import toast from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      borderRadius: '10px',
      background: '#10B981',
      color: '#fff',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    style: {
      borderRadius: '10px',
      background: '#EF4444',
      color: '#fff',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444',
    },
  });
};

export const showInfo = (message) => {
  toast(message, {
    icon: '💡',
    style: {
      borderRadius: '10px',
      background: '#3B82F6',
      color: '#fff',
    },
  });
};
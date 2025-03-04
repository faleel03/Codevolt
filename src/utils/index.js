export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const formatTime = (time) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};
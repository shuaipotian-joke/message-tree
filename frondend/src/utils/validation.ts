export const validateUsername = (username: string): string | null => {
  if (!username) return 'Username is required';
  if (username.length < 5 || username.length > 20) {
    return 'Username must be between 5 and 20 characters';
  }
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    return 'Username can only contain letters and numbers';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8 || password.length > 20) {
    return 'Password must be between 8 and 20 characters';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
    return 'Password must contain at least one special character';
  }
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validateMessageContent = (content: string): string | null => {
  if (!content) return 'Message content is required';
  if (content.length < 3) return 'Message must be at least 3 characters long';
  if (content.length > 200) return 'Message must be no more than 200 characters long';
  return null;
};

export const getCharacterCount = (content: string): { used: number; remaining: number } => {
  const used = content.length;
  const remaining = 200 - used;
  return { used, remaining };
};

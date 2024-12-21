const BACKEND_URL = `${import.meta.env.VITE_EXPRESS_BACKEND_URL}/auth`;

const getUser = () => {
  const token = localStorage.getItem('token')
  if (!token) return null

  try {
    const user = JSON.parse(atob(token.split('.')[1]))
    const isExpired = user.exp * 1000 < Date.now()
    if (isExpired) {
      console.error('Token has expired.')
      localStorage.removeItem('token')
      return null
    }
    return user;
  } catch (err) {
    console.error('Failed to decode token:', err.message)
    return null
  }
};

const signup = async (formData) => {
  try {
    const res = await fetch(`${BACKEND_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`, 
      },
      body: JSON.stringify(formData),
    });

    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.error || 'Failed to sign up.')
    }

    localStorage.setItem('token', json.token)
    return json.user;
  } catch (err) {
    console.error('Signup Error:', err.message)
    throw err
  }
};

const signin = async (credentials) => {
  try {
    const res = await fetch(`${BACKEND_URL}/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const json = await res.json()
    if (!res.ok) {
      throw new Error(json.error || 'Failed to sign in.')
    };

    if (json.token) {
      localStorage.setItem('token', json.token);
      const user = JSON.parse(atob(json.token.split('.')[1]))
      return user
    };

    throw new Error('Signin did not return a valid token.')
  } catch (err) {
    console.error('Signin Error:', err.message)
    throw err;
  }
};

const signout = () => {
  localStorage.removeItem('token')
};

export { signup, signin, getUser, signout };

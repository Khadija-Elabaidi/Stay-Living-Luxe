const API_URL = '/api/auth';

export const authService = {
  
  async register(userData) {
    const nameParts = userData.fullName.trim().split(' ');
    const prenom = nameParts[0] || '';
    const nom = nameParts.slice(1).join(' ') || prenom;

    const payload = {
      nom: nom,
      prenom: prenom,
      email: userData.email,
      motPass: userData.password,
      telephone: userData.phone
    };

    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Erreur lors de l'inscription.");
    }

    return await response.json();
  },

  
  async login(credentials) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        motPass: credentials.password
      })
    });

    if (!response.ok) {
      throw new Error('Identifiants incorrects.');
    }

    const data = await response.json();


    const token = data.token || data.jwtToken || data.jwt;
    const userData = data.utilisateur || data.user || data;

    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('jwtToken', token);
    }

    const fullUser = { ...userData, token };
    localStorage.setItem('currentUser', JSON.stringify(fullUser));
    localStorage.setItem('user', JSON.stringify(fullUser));

    return fullUser;
  },

  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser') || localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
};
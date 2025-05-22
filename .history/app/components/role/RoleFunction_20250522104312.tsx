
function getRoleFromToken(token: string): string | null {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.role || null;
    } catch (err) {
      console.error('Invalid token');
      return null;
    }
  }
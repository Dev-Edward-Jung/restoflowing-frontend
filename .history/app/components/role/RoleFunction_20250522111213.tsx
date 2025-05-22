

export function getUserInfoFromToken(token: string): { role: string | null, id: string | null } {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      return {
        role: decodedPayload.role || null,
        id: decodedPayload.id || null, // 일반적으로 JWT에서 `sub`은 userId로 쓰입니다
        email : decodedPayload.sub || null
      };
    } catch (err) {
      console.error('Invalid token');
      return { role: null, id: null };
    }
  }
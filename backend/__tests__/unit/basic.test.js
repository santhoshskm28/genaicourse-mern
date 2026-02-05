describe('Basic Module Tests', () => {
  it('should import auth controller successfully', async () => {
    const { register, login, getMe } = await import('../../controllers/authController.js');
    expect(typeof register).toBe('function');
    expect(typeof login).toBe('function');
    expect(typeof getMe).toBe('function');
  });

  it('should import User model successfully', async () => {
    const User = await import('../../models/User.js');
    expect(User.default).toBeDefined();
  });
});
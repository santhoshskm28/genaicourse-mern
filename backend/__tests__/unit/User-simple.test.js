describe('User Model - Basic Tests', () => {
  describe('Model Import', () => {
    it('should import User model successfully', async () => {
      const User = await import('../../models/User.js');
      expect(User.default).toBeDefined();
      expect(User.default.modelName).toBe('User');
    });

    it('should have correct collection name', async () => {
      const User = await import('../../models/User.js');
      expect(User.default.collection.collectionName).toBe('users');
    });

    it('should have schema defined', async () => {
      const User = await import('../../models/User.js');
      expect(User.default.schema).toBeDefined();
      expect(User.default.schema.paths).toBeDefined();
    });
  });

  describe('Schema Fields', () => {
    it('should have name field', async () => {
      const User = await import('../../models/User.js');
      const nameField = User.default.schema.paths.name;
      expect(nameField).toBeDefined();
      expect(nameField.path).toBe('name');
    });

    it('should have email field', async () => {
      const User = await import('../../models/User.js');
      const emailField = User.default.schema.paths.email;
      expect(emailField).toBeDefined();
      expect(emailField.path).toBe('email');
    });

    it('should have password field', async () => {
      const User = await import('../../models/User.js');
      const passwordField = User.default.schema.paths.password;
      expect(passwordField).toBeDefined();
      expect(passwordField.path).toBe('password');
      expect(passwordField.options.select).toBe(false);
    });

    it('should have role field with enum values', async () => {
      const User = await import('../../models/User.js');
      const roleField = User.default.schema.paths.role;
      expect(roleField).toBeDefined();
      expect(roleField.path).toBe('role');
      expect(roleField.enumValues).toContain('student');
      expect(roleField.enumValues).toContain('instructor');
      expect(roleField.enumValues).toContain('admin');
    });
  });

  describe('Instance Methods', () => {
    it('should have comparePassword method', async () => {
      const User = await import('../../models/User.js');
      const user = new User.default();
      expect(typeof user.comparePassword).toBe('function');
    });

    it('should have getPublicProfile method', async () => {
      const User = await import('../../models/User.js');
      const user = new User.default();
      expect(typeof user.getPublicProfile).toBe('function');
    });

    it('should have isEnrolledInCourse method', async () => {
      const User = await import('../../models/User.js');
      const user = new User.default();
      expect(typeof user.isEnrolledInCourse).toBe('function');
    });

    it('should have enrollInCourse method', async () => {
      const User = await import('../../models/User.js');
      const user = new User.default();
      expect(typeof user.enrollInCourse).toBe('function');
    });

    it('should have updateCourseProgress method', async () => {
      const User = await import('../../models/User.js');
      const user = new User.default();
      expect(typeof user.updateCourseProgress).toBe('function');
    });
  });

  describe('Basic Functionality', () => {
    it('should create user instance correctly', async () => {
      const User = await import('../../models/User.js');
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'student'
      };
      
      const user = new User.default(userData);
      
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
    });

    it('should use default values for optional fields', async () => {
      const User = await import('../../models/User.js');
      const user = new User.default({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      
      expect(user.role).toBe('student'); // Default role
      expect(user.isActive).toBe(true); // Default active
      expect(user.isVerified).toBe(false); // Default not verified
    });
  });
});
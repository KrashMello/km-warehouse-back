import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let user: TestingModule;

  beforeAll(async () => {
    user = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();
  });

  describe('findMany', () => {
    it('should return a object with data[] and max_pages number', () => {
      const userController = user.get(UserController);
      expect(userController.findAll({ page: 0, limit: 10 })).toBe({
        data: [
          {
            id: 1,
            username: 'test',
            email: 'test@test.com',
            status_id: 1,
          },
        ],
        max_pages: 0,
      });
    });
  });
});

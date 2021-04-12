import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './../src/users/user.entity';
import { UsersModule } from './../src/users/users.module';
import { mockUserRepository } from './utils/mocks/userRepository';

describe('UserController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getRepositoryToken(User))
      .useValue(mockUserRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users', () => {
    it('/ (GET)', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .expect(200, await mockUserRepository.find());
      expect(mockUserRepository.find).toBeCalled();
    });

    it(':id (GET)', async () => {
      await request(app.getHttpServer())
        .get('/users/1')
        .expect(200, await mockUserRepository.findOne());
      expect(mockUserRepository.findOne).toBeCalledWith('1');
    });
  });
});

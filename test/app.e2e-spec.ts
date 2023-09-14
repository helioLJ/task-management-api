import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: CreateAuthDto = {
      name: 'test',
      email: 'test@gmail.com',
      password: '123',
    };
    describe('SignUp', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ email: '', password: '123' })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({ email: 'test@gmail.com', password: '' })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/register').expectStatus(400);
      });
      it('should register', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('SignIn', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: '', password: '123' })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody({ email: 'test@gmail.com', password: '' })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });
      it('should login', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      // it('should edit user', () => {
      //   const dto: EditUserDto = {
      //     firstName: 'Hélio',
      //     email: 'helio@email.com',
      //   };
      //   return pactum
      //     .spec()
      //     .patch('/users')
      //     .withHeaders({ Authorization: 'Bearer $S{userAt}' })
      //     .withBody(dto)
      //     .expectStatus(200)
      //     .expectBodyContains(dto.firstName)
      //     .expectBodyContains(dto.email);
      // });
    });
  });

  describe('Task', () => {
    describe('Create Task', () => {
      it.todo('should not create task without token');
      it.todo('should create task');
    });

    describe('Edit Task', () => {
      it.todo('should not change task without token');
      it.todo('should not change task if isnt yours');
      it.todo('should change task title');
      it.todo('should change task description');
      it.todo('should change task completed');
      it.todo('should change task list');
      it.todo('should change task due date');
    });

    describe('Get Indidivual Task', () => {
      it.todo('should not get task without token');
      it.todo('should not get task if isnt yours');
      it.todo('should get user task (everything)');
    });

    describe('Get Many Tasks', () => {
      it.todo('should not get tasks without token');
      it.todo('should not get tasks if isnt yours');
      it.todo('should get user tasks (title, due-date, list, subtasks)');
    });

    describe('Delete Task', () => {
      it.todo('should not delete task without token');
      it.todo('should not delete task if isnt yours');
      it.todo('should delete task');
    });
  });

  describe('Tag', () => {
    describe('Create tag', () => {
      it.todo('should not create tag without token');
      it.todo('should not create tag that exists');
      it.todo('should create tag');
    });

    describe('Edit tag', () => {
      it.todo('should not change tag without token');
      it.todo('should not change tag if isnt yours');
      it.todo('should change tag title');
    });

    describe('Get Indidivual tag', () => {
      it.todo('should not get tag without token');
      it.todo('should not get tag if isnt yours');
      it.todo('should get task tags');
    });

    describe('Get Many tags', () => {
      it.todo('should not get tags without token');
      it.todo('should not get tags if isnt yours');
      it.todo('should get user tags');
    });

    describe('Delete tag', () => {
      it.todo('should not delete tag without token');
      it.todo('should not delete tag if isnt yours');
      it.todo('should delete tag');
    });
  });

  describe('Subtask', () => {
    describe('Create subtask', () => {
      it.todo('should not create subtask without token');
      it.todo('should create subtask');
    });

    describe('Edit subtask', () => {
      it.todo('should not change subtask without token');
      it.todo('should not change subtask if isnt yours');
      it.todo('should change subtask title');
      it.todo('should change subtask completed');
    });

    describe('Get Many subtasks', () => {
      it.todo('should not get subtasks without token');
      it.todo('should not get subtasks if isnt yours');
      it.todo('should get task subtasks');
    });

    describe('Delete subtask', () => {
      it.todo('should not delete subtask without token');
      it.todo('should not delete subtask if isnt yours');
      it.todo('should delete subtask');
    });
  });
});

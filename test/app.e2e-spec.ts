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
      it('should register other user', () => {
        return pactum
          .spec()
          .post('/auth/register')
          .withBody({
            name: 'other',
            email: 'other@email.com',
            password: '123',
          })
          .stores('otherUser', 'access_token')
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
      it('should not create task without token', () => {
        return pactum
          .spec()
          .post('/task')
          .withBody({ title: 'New Task' })
          .expectStatus(401);
      });
      it('should create task', () => {
        return pactum
          .spec()
          .post('/task')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ title: 'New Task' })
          .expectBodyContains('New Task')
          .expectStatus(201)
          .stores('taskId', 'id');
      });
      it('should create other task', () => {
        return pactum
          .spec()
          .post('/task')
          .withHeaders({ Authorization: 'Bearer $S{otherUser}' })
          .withBody({ title: 'Other Task' })
          .expectBodyContains('Other Task')
          .stores('otherTaskId', 'id');
      });
    });

    describe('Edit Task', () => {
      it('should not change task without token', () => {
        return pactum
          .spec()
          .patch('/task/$S{taskId}')
          .withBody({ title: 'Changed Task' })
          .expectStatus(401);
      });
      it('should not change task if isnt yours', () => {
        return pactum
          .spec()
          .patch('/task/{id}')
          .withPathParams('id', '$S{otherTaskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ title: 'Changed Task' })
          .expectStatus(403);
      });
      it('should not change task if does not exist', () => {
        return pactum
          .spec()
          .patch('/task/999999999')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ title: 'Changed Task' })
          .expectStatus(404);
      });
      it('should change task title', () => {
        return pactum
          .spec()
          .patch('/task/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ title: 'Changed Task' })
          .expectJsonLike({
            title: 'Changed Task',
          })
          .expectStatus(200);
      });
      it('should change task description', () => {
        return pactum
          .spec()
          .patch('/task/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ description: 'Im a description' })
          .expectJsonLike({
            title: 'Changed Task',
            description: 'Im a description',
          })
          .expectStatus(200);
      });
      it('should change task completed', () => {
        return pactum
          .spec()
          .patch('/task/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ completed: true })
          .expectJsonLike({
            title: 'Changed Task',
            description: 'Im a description',
            completed: true,
          })
          .expectStatus(200);
      });
      it('should change task list', () => {
        return pactum
          .spec()
          .patch('/task/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ list: 'Work' })
          .expectJsonLike({
            title: 'Changed Task',
            description: 'Im a description',
            completed: true,
            list: 'Work',
          })
          .expectStatus(200);
      });
      it('should change task due date', () => {
        const dueDate = new Date('2023-09-18').toISOString();

        return pactum
          .spec()
          .patch('/task/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ dueDate: dueDate })
          .expectJsonLike({
            title: 'Changed Task',
            description: 'Im a description',
            completed: true,
            list: 'Work',
            dueDate: dueDate,
          })
          .expectStatus(200);
      });
    });

    describe('Get Indidivual Task', () => {
      it('should not get task without token', () => {
        return pactum
          .spec()
          .get('/task/$S{taskId}')
          .withPathParams('id', '$S{taskId}')
          .expectStatus(401);
      });
      it('should not get task if isnt yours', () => {
        return pactum
          .spec()
          .get('/task/{id}')
          .withPathParams('id', '$S{otherTaskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(403);
      });
      it('should get user task (everything)', () => {
        const dueDate = new Date('2023-09-18').toISOString();

        return pactum
          .spec()
          .get('/task/{id}')
          .withPathParams('id', '$S{taskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectJsonLike({
            title: 'Changed Task',
            description: 'Im a description',
            completed: true,
            list: 'Work',
            dueDate: dueDate,
          })
          .expectStatus(200);
      });
    });

    describe('Get Many Tasks', () => {
      it('should not get tasks without token', () => {
        return pactum.spec().get('/task').expectStatus(401);
      });
      it('should get user tasks (title, due-date, list, subtasks)', () => {
        return pactum
          .spec()
          .get('/task')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectJsonLength(1)
          .expectStatus(200);
      });
    });

    describe('Delete Task', () => {
      it('should not delete task without token', () => {
        return pactum
          .spec()
          .delete('/task/$S{taskId}')
          .withPathParams('id', '$S{taskId}')
          .expectStatus(401);
      });
      it('should not delete task if isnt yours', () => {
        return pactum
          .spec()
          .delete('/task/{id}')
          .withPathParams('id', '$S{otherTaskId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(403);
      });
      it('should delete task', () => {
        return pactum
          .spec()
          .delete('/task/{id}')
          .withPathParams('id', '$S{otherTaskId}')
          .withHeaders({ Authorization: 'Bearer $S{otherUser}' })
          .expectJsonMatchStrict({ message: 'Task deleted.' })
          .expectStatus(200);
      });
    });
  });

  describe('Tag', () => {
    describe('Create Tag', () => {
      it('should not create tag without token', () => {
        return pactum
          .spec()
          .post('/tag')
          .withBody({ name: 'New Tag' })
          .expectStatus(401);
      });

      it('should create tag', () => {
        return pactum
          .spec()
          .post('/tag')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ name: 'New Tag' })
          .expectBodyContains('New Tag')
          .expectStatus(201)
          .stores('tagId', 'id');
      });

      it('should create another tag', () => {
        return pactum
          .spec()
          .post('/tag')
          .withHeaders({ Authorization: 'Bearer $S{otherUser}' })
          .withBody({ name: 'Other Tag' })
          .expectBodyContains('Other Tag')
          .expectStatus(201)
          .stores('otherTagId', 'id');
      });

      it('should not create tag that exists', () => {
        return pactum
          .spec()
          .post('/tag')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ name: 'New Tag' })
          .expectStatus(403);
      });
    });

    describe('Edit Tag', () => {
      it('should not change tag without token', () => {
        return pactum
          .spec()
          .patch('/tag/$S{tagId}')
          .withBody({ title: 'Changed Tag' })
          .expectStatus(401);
      });

      it("should not change tag if it isn't yours", () => {
        return pactum
          .spec()
          .patch('/tag/{id}')
          .withPathParams('id', '$S{otherTagId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ title: 'Changed Tag' })
          .expectStatus(403);
      });

      it('should change tag title', () => {
        return pactum
          .spec()
          .patch('/tag/{id}')
          .withPathParams('id', '$S{tagId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody({ name: 'Changed Tag' })
          .expectJsonLike({
            name: 'Changed Tag',
          })
          .expectStatus(200);
      });
    });

    describe('Get Many Tags', () => {
      it('should not get tags without token', () => {
        return pactum.spec().get('/tag').expectStatus(401);
      });

      it('should get user tags', () => {
        return pactum
          .spec()
          .get('/tag')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectJsonLength(1)
          .expectStatus(200);
      });
    });

    describe('Delete Tag', () => {
      it('should not delete tag without token', () => {
        return pactum
          .spec()
          .delete('/tag/$S{tagId}')
          .withPathParams('id', '$S{tagId}')
          .expectStatus(401);
      });
      it('should not delete tag if isnt yours', () => {
        return pactum
          .spec()
          .delete('/tag/{id}')
          .withPathParams('id', '$S{otherTagId}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(403);
      });
      it('should delete tag', () => {
        return pactum
          .spec()
          .delete('/tag/{id}')
          .withPathParams('id', '$S{otherTagId}')
          .withHeaders({ Authorization: 'Bearer $S{otherUser}' })
          .expectJsonMatchStrict({ message: 'Tag deleted.' })
          .expectStatus(200);
      });
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

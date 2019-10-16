/* eslint-disable dot-notation */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import { User, Question } from '../../models';

const deleteUsers = async () => {
  await User.deleteMany({ isSubscribed: true });
};
chai.use(chaiHttp);
const { expect } = chai;
let token;
let votingToken;
let questionId;
let totalVotesBefore;
let totalVotesAfter;
before('login with an existing user details to get token', async () => {
  it('should create a user and verify the user', async () => {
    const userDetails = {
      username: 'JthnDmkloes',
      password: 'password',
      email: 'chris90@wemail.com',
      firstName: 'John',
      lastName: 'Doe',
    };
    const response = await chai.request(app).post('/api/v1/auth/signup')
      .send(userDetails);
    expect(response.status).to.equal(200);
    await User.updateOne({ email: 'chris90@wemail.com' },
      { $set: { isVerified: true } });
  });

  it('should login the user to get token', async () => {
    const response = await chai.request(app).post('/api/v1/auth/login')
      .send({
        email: 'chris90@wemail.com',
        password: 'password',
      });
    token = response.body.data.userDetails.token;
    deleteUsers();
  });

  it('should create a different user in order to vote', async () => {
    const userDetails2 = {
      username: 'JthnDmkloes2',
      password: 'password',
      email: 'chris902@wemail.com',
      firstName: 'John',
      lastName: 'Doe',
    };
    const response = await chai.request(app).post('/api/v1/auth/signup')
      .send(userDetails2);
    expect(response.status).to.equal(200);
    await User.updateOne({ email: 'chris902@wemail.com' },
      { $set: { isVerified: true } });
  });
  it('should login the user to get token for voting', async () => {
    const response = await chai.request(app).post('/api/v1/auth/login')
      .send({
        email: 'chris902@wemail.com',
        password: 'password',
      });
    votingToken = response.body.data.userDetails.token;
    deleteUsers();
  });
});
describe('Integration tests for question controller', () => {
  it('should create a new question', async () => {
    const response = await chai.request(app).post('/api/v1/question')
      .set('x-access-token', token)
      .send({
        title: 'this title is for the integration test',
        description: 'this description is also for integration test',
        labels: 'express, mongoDB',
      });
    const { data } = response.body;
    questionId = data.question['_id'];
    expect(data.success).to.equal(true);
    expect(data.question).to.have.property('_id');
    expect(data.question['_id']).to.be.an('string');
  });
  it('should not create question when invalid data is passed', async () => {
    const response = await chai.request(app).post('/api/v1/question')
      .set('x-access-token', token)
      .send({
        description: 'this description is also for integration test',
        labels: 'express, mongoDB',
      });
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal('Question validation failed: title:'
    + ' Path `title` is required.');
  });
  it('should get all questions', async () => {
    const response = await chai.request(app).get('/api/v1/questions');
    const { data } = response.body;
    expect(data.success).to.equal(true);
    expect(data).to.have.property('questions');
    expect(data.questions).to.be.an('array');
    expect(data.questions.length).to.not.equal(null);
  });
  it('should return a specific question', async () => {
    const response = await chai.request(app).get(`/api/v1/question/${questionId}`);
    const { data } = response.body;
    expect(data.success).to.equal(true);
    expect(data).to.have.property('question');
    expect(data.question).to.be.an('object');
  });
  it('should return error when the id is invalid', async () => {
    const response = await chai.request(app).get('/api/v1/question/funnyid');
    expect(response.body.success).to.equal(false);
    expect(response.body.message)
      .to.equal('Invalid request. \'A valid ID\' field is required');
  });
  it('should upvote a question', async () => {
    const response = await chai.request(app).patch(`/api/v1/vote/${questionId}/up`)
      .set('x-access-token', votingToken);
    const { data } = response.body;
    totalVotesBefore = data.totalVotes;
    expect(data.success).to.equal(true);
    expect(data.message).to
      .equal('Thank you for your feedback. Your vote has been recorded');
  });
  it('should not allow a user vote more than once', async () => {
    const response = await chai.request(app).patch(`/api/v1/vote/${questionId}/up`)
      .set('x-access-token', votingToken);
    const { data } = response.body;
    totalVotesAfter = data.totalVotes;
    expect(totalVotesBefore).to.equal(totalVotesAfter);
    expect(data.success).to.equal(true);
    expect(data.message).to
      .equal('Thank you for your feedback. Your vote has been recorded');
  });
  it('should downvote a question', async () => {
    const response = await chai.request(app).patch(`/api/v1/vote/${questionId}/down`)
      .set('x-access-token', votingToken);
    const { data } = response.body;
    expect(data.success).to.equal(true);
    expect(data.message).to
      .equal('Thank you for your feedback. Your vote has been recorded');
  });
  it('should not allow a user vote his own question', async () => {
    const response = await chai.request(app).patch(`/api/v1/vote/${questionId}/down`)
      .set('x-access-token', token);
    const { body } = response;
    expect(body.success).to.equal(false);
    expect(body.message).to
      .equal('You cannot vote on your own question');
  });
  it('should return error if the question ID is invalid', async () => {
    const response = await chai.request(app).patch('/api/v1/vote/invalid_id/up')
      .set('x-access-token', token);
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to
      .equal('Invalid request. \'A valid ID\' field is required');
  });
  it('should return error if there are no questions', async () => {
    await Question.deleteMany({ isSubscribed: true });
    const response = await chai.request(app).get('/api/v1/questions');
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal('no questions found');
  });
});

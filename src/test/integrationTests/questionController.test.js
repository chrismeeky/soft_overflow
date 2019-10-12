/* eslint-disable dot-notation */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import { User } from '../../models';

const deleteUsers = async () => {
  await User.deleteMany({ isSubscribed: true });
};
chai.use(chaiHttp);
const { expect } = chai;
let token;
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
});

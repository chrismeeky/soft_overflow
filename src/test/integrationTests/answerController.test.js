/* eslint-disable dot-notation */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
import { User, } from '../../models';

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
describe('Integration tests for answer controller', () => {
  it('should answer a question', async () => {
    const response = await chai.request(app)
      .post('/api/v1/answer/5da204f9fcf7d12116c7c9be')
      .set('x-access-token', token)
      .send({
        response: 'this is a response from the integration test to a question',
      });
    const { data } = response.body;
    expect(data.success).to.equal(true);
    expect(data).to.have.property('answer');
    expect(data.answer).to.be.an('object');
    expect(data.answer['_id']).to.be.a('string');
  });
  it('should return an error is the question ID is invalid', async () => {
    const response = await chai.request(app)
      .post('/api/v1/answer/invalid_Question_Id')
      .set('x-access-token', token)
      .send({
        response: 'this is a response from the integration test to a question',
      });
    expect(response.body.success).to.equal(false);
    expect(response.body.message).to.equal('A valid id is required');
  });
});

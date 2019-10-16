import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('integration test for the search functionality', () => {
  it('should return users list of users that match a related query', async () => {
    const response = await chai.request(app).get('/api/v1/search')
      .send({
        searchTerm: 'this title is for the integration test'
      });
    const question = response.body.data;
    expect(response.body.data.success).to.equal(true);
    expect(question.length).to.not.equal(0);
  });
});

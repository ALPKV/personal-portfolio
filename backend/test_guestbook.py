import unittest
from fastapi.testclient import TestClient
from api.index import app
from backend.main import comments, comment_token_hashes

class GuestbookTests(unittest.TestCase):
    def setUp(self):
        comments.clear()
        comment_token_hashes.clear()
        self.client = TestClient(app)
        self.body = {'name': 'Visitor', 'message': 'Hello from a test.'}

    def test_crud_and_ownership(self):
        created = self.client.post('/api/comments', json=self.body)
        self.assertEqual(created.status_code, 201)
        saved = created.json()
        path = '/api/comments/' + saved['id']
        headers = {'X-Comment-Token': saved['edit_token']}
        public = self.client.get('/api/comments').json()
        self.assertEqual(len(public), 1)
        self.assertNotIn('edit_token', public[0])
        updated = {'name': 'Visitor', 'message': 'Edited by the creator.'}
        self.assertEqual(self.client.put(path, json=updated).status_code, 403)
        self.assertEqual(self.client.put(path, json=updated, headers={'X-Comment-Token': 'wrong'}).status_code, 403)
        self.assertEqual(self.client.delete(path).status_code, 403)
        response = self.client.put(path, json=updated, headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], updated['message'])
        self.assertEqual(self.client.delete(path, headers=headers).status_code, 204)
        self.assertEqual(self.client.get('/api/comments').json(), [])
        self.assertEqual(self.client.put(path, json=updated, headers=headers).status_code, 404)
        self.assertEqual(self.client.delete(path, headers=headers).status_code, 404)

    def test_validation(self):
        for body in [{'name': ' ', 'message': 'Hello'}, {'name': 'Visitor', 'message': ''},
                     {'name': 'Visitor'}, {'name': 'Visitor', 'message': 'x' * 1001},
                     {'name': 'Visitor', 'message': 'Hi', 'edit_token': 'forged'}]:
            self.assertEqual(self.client.post('/api/comments', json=body).status_code, 422)
        self.assertEqual(self.client.get('/api/comments').json(), [])

    def test_projects_are_read_only(self):
        self.assertEqual(self.client.get('/api/projects').status_code, 200)
        self.assertEqual(self.client.get('/api/projects/1').status_code, 200)
        self.assertEqual(self.client.post('/api/projects', json={}).status_code, 405)
        self.assertEqual(self.client.put('/api/projects/1', json={}).status_code, 405)
        self.assertEqual(self.client.delete('/api/projects/1').status_code, 405)

    def tearDown(self):
        comments.clear()
        comment_token_hashes.clear()

if __name__ == '__main__':
    unittest.main()

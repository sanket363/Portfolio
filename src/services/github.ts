import axios from 'axios';

const GITHUB_API = 'https://api.github.com';
const USERNAME = 'sanket363';

export const getRepositories = async () => {
  const response = await axios.get(`${GITHUB_API}/users/${USERNAME}/repos`);
  return response.data.sort((a: any, b: any) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
};

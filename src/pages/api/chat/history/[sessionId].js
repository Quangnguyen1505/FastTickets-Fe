const baseUrl = process.env.NEXT_PUBLIC_GO_ID;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end('Method Not Allowed');
  }

  const { sessionId } = req.query;
  const userId = req.headers['x-client-id'];
  const token = req.headers['authorization'];

  const backendRes = await fetch(`${baseUrl}/v1/2024/chat-with-employee/history/${sessionId}`, {
    method: 'GET',
    headers: {
      'x-client-id': userId,
      'authorization': `Bearer ${token}`
    }
  });

  console.log('Backend response:', backendRes);

  const data = await backendRes.json();
  res.status(backendRes.status).json(data);
}
// Serverless function for Vercel
const handler = async (req, res) => {
  console.log('API Route: /api/orders - Request received');
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    console.log('Invalid method:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Fetching orders from Snipcart...');
    
    // Create Basic Auth header
    const secret = process.env.SNIPCART_SECRET_KEY + ":";
    const base64Secret = Buffer.from(secret).toString('base64');

    const response = await fetch('https://app.snipcart.com/api/orders?offset=0&limit=50&status=processed', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${base64Secret}`
      }
    });

    if (!response.ok) {
      console.error('Snipcart API error:', response.status, response.statusText);
      throw new Error('Failed to fetch from Snipcart');
    }

    const data = await response.json();
    console.log('Successfully fetched orders. Count:', data.items?.length);

    // Filter out sensitive data, only return product names for now
    const sanitizedOrders = data.items
      ?.map(order => order.items?.map(item => ({
        productName: item.name
      })))
      .flat();

    console.log('Sanitized orders:', sanitizedOrders);
    console.log('orders', response)
    
    return res.status(200).json(sanitizedOrders);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler; 
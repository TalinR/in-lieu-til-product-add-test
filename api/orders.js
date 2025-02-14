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

    const response = await fetch('https://app.snipcart.com/api/orders?offset=0&limit=6&status=processed', {
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

    // Log the first order's first item to see its structure
    if (data.items?.[0]?.items?.[0]) {
      console.log('Example item structure:', JSON.stringify(data.items[0].items[0], null, 2));
    }

    // Filter out sensitive data, return product names and colors
    const sanitizedOrders = data.items
      ?.map(order => order.items?.map(item => {
        // Find the color from customFields
        const colorField = item.customFields?.find(
          field => field.name === 'Colour' || field.name === 'Color'
        );
        const color = colorField?.value || '';

        console.log('Processing item:', {
          name: item.name,
          color: color,
          customFields: item.customFields,
          orderId: order.invoiceNumber,
          timestamp: new Date(order.creationDate).getTime()
        });

        return {
          productName: item.name,
          color: color,
          orderId: order.invoiceNumber,
          timestamp: new Date(order.creationDate).getTime()
        };
      }))
    //   .flat()
    //   .sort((a, b) => b.timestamp - a.timestamp) // Sort by newest first
    //   .slice(0, 6); // Only return the 6 most recent orders

    console.log('Sanitized orders:', sanitizedOrders);
    console.log('orders', data)
    
    return res.status(200).json(sanitizedOrders);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler; 


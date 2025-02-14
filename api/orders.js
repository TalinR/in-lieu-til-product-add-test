module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
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
      throw new Error(`Snipcart API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter and transform the data to only include necessary information
    const sanitizedOrders = data.items
      .filter(order => order.items && order.items.length > 0)
      .map(order => {
        const item = order.items[0]; // Get first item from order
        return {
          time: new Date(order.creationDate).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          from: item.name.split(' ')[0].substring(0, 5),
          flight: order.invoiceNumber.substring(0, 6),
          remarks: `${item.customFields.find(f => f.name === 'Color')?.value || ''} ${item.name}`.substring(0, 20)
        };
      });

    res.status(200).json(sanitizedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
}; 
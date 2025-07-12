export default function handler(req, res) {
  res.status(200).json({ 
    message: "Hello from SmartSyllabus backend!", 
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
} 
const mongoose = require('mongoose');
const whatsappService = require('../services/whatsapp-service');
const Settings = require('../models/Settings');
require('dotenv').config();

async function testWhatsAppMessage() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Get WhatsApp config
    const config = await Settings.getWhatsAppConfig();
    console.log('\n📱 WhatsApp Configuration:');
    console.log('- Enabled:', config.enabled);
    console.log('- Phone Number:', config.number);
    console.log('- Phone Number ID:', config.phoneNumberId);
    console.log('- Access Token:', config.accessToken ? '***' : 'Not set');

    // Create a test order
    const testOrder = {
      _id: '507f1f77bcf86cd799439011',
      guestCustomer: {
        fullName: 'Test Customer',
        phoneNumber: '+923187074919'
      },
      orderItems: [
        {
          title: 'Test Product',
          price: 5000,
          quantity: 1
        }
      ],
      totalAmount: 5000
    };

    console.log('\n📦 Test Order:');
    console.log('- Customer:', testOrder.guestCustomer.fullName);
    console.log('- Phone:', testOrder.guestCustomer.phoneNumber);
    console.log('- Total:', testOrder.totalAmount);

    // Send test message
    console.log('\n📤 Sending WhatsApp message...');
    const result = await whatsappService.sendOrderConfirmation(testOrder);

    console.log('\n✅ Result:');
    console.log('- Success:', result.success);
    console.log('- Message:', result.message);
    if (result.isDevelopment) {
      console.log('- Mode: Development (logging only)');
    }

    await mongoose.connection.close();
    console.log('\n✅ Test completed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testWhatsAppMessage();

const { Client } = require('@notionhq/client');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function testConnection() {
  console.log('🔍 Testing Notion Integration...\n');
  
  console.log('📋 Configuration:');
  console.log(`Token: ${process.env.NOTION_TOKEN ? process.env.NOTION_TOKEN.substring(0, 20) + '...' : 'NOT SET'}`);
  console.log(`Database ID: ${DATABASE_ID || 'NOT SET'}\n`);
  
  if (!process.env.NOTION_TOKEN) {
    console.error('❌ NOTION_TOKEN is not set in .env.local');
    return;
  }
  
  if (!DATABASE_ID) {
    console.error('❌ NOTION_DATABASE_ID is not set in .env.local');
    return;
  }
  
  try {
    console.log('🚀 Testing database access...');
    const response = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });
    
    console.log('✅ SUCCESS: Can access database!');
    console.log(`📚 Database title: ${response.title?.[0]?.plain_text || 'Untitled'}`);
    console.log(`🔗 Database URL: ${response.url}`);
    
    console.log('\n📊 Database properties:');
    Object.entries(response.properties).forEach(([name, prop]) => {
      console.log(`   - ${name} (${prop.type})`);
    });
    
    console.log('\n🔍 Testing database query...');
    const queryResponse = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 1,
    });
    
    console.log(`✅ SUCCESS: Found ${queryResponse.results.length} page(s) in database`);
    
    if (queryResponse.results.length > 0) {
      const page = queryResponse.results[0];
      console.log(`📄 First page ID: ${page.id}`);
      console.log('🏷️  Properties:', Object.keys(page.properties));
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    
    if (error.code === 'unauthorized') {
      console.log('\n🔧 TROUBLESHOOTING STEPS:');
      console.log('1. Make sure you copied the complete integration token');
      console.log('2. Verify the integration has access to your database:');
      console.log('   - Go to your Notion database');
      console.log('   - Click "Share" in the top-right');
      console.log('   - Make sure your integration is listed');
      console.log('   - If not, click "Invite" and select your integration');
    } else if (error.code === 'object_not_found') {
      console.log('\n🔧 TROUBLESHOOTING STEPS:');
      console.log('1. Double-check your database ID');
      console.log('2. Make sure the database exists and is accessible');
    }
  }
}

testConnection();

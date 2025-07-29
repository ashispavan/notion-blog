const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
require('dotenv').config({ path: '.env.local' });

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });
const DATABASE_ID = process.env.NOTION_DATABASE_ID;

async function debugContent() {
  console.log('🔍 Debugging content conversion...\n');
  
  try {
    // Get the first published post
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
      page_size: 1,
    });

    if (response.results.length === 0) {
      console.log('❌ No published posts found');
      return;
    }

    const page = response.results[0];
    console.log(`📄 Testing page: ${page.id}`);
    console.log(`📝 Title: ${page.properties.Title?.title?.[0]?.plain_text || 'Untitled'}`);
    
    console.log('\n🔄 Converting to markdown...');
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    console.log(`📊 Found ${mdBlocks.length} blocks`);
    
    if (mdBlocks.length === 0) {
      console.log('⚠️  No content blocks found in the page');
      console.log('💡 Make sure you have added content to your Notion page (not just the database properties)');
      return;
    }
    
    const content = n2m.toMarkdownString(mdBlocks).parent;
    console.log(`📝 Content length: ${content.length} characters`);
    console.log('\n📄 Content preview:');
    console.log('---');
    console.log(content.substring(0, 500) + (content.length > 500 ? '...' : ''));
    console.log('---');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugContent();
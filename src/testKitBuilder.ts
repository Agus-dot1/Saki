import { fetchKitBuilderItems } from './services/kitbuilderService';

async function testFetchKitBuilderItems() {
  console.log('Testing fetchKitBuilderItems...');
  try {
    const items = await fetchKitBuilderItems();
    console.log('Successfully fetched items:', items);
    console.log('Number of items:', items.length);
  } catch (error) {
    console.error('Error fetching kit builder items:', error);
  }
}

// Run the test
testFetchKitBuilderItems();